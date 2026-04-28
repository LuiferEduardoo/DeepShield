import { Storage } from "@plasmohq/storage"

import type { BlockEvent, RuleMap } from "~lib/blocking"
import {
  BLOCKED_CATEGORIES_KEY,
  BLOCKED_SITES_KEY,
  BLOCK_EVENTS_KEY,
  extractHostname,
  FOCUS_MODE_KEY,
  isBlockedUrl,
  isOverLimit,
  matchesSite,
  MAX_EVENTS,
  migrateRules,
  ruleApplies
} from "~lib/blocking"
import { categoryById, domainsForCategories } from "~lib/categories"
import {
  DEFAULT_FOCUS_SCHEDULE,
  FOCUS_CATEGORIES_KEY,
  FOCUS_SCHEDULE_KEY,
  FOCUS_SITES_KEY,
  isFocusActive,
  type FocusSchedule
} from "~lib/focus"
import {
  categoryUsageKey,
  getUsage,
  pruneUsage,
  siteUsageKey,
  TIME_SPENT_KEY,
  TIME_SPENT_RETENTION_DAYS,
  todayKey,
  USAGE_KEY,
  withIncrement,
  type DailyUsage
} from "~lib/usage"

const storage = new Storage()
const TICK_ALARM = "usage-tick"

const state = {
  siteRules: {} as RuleMap,
  categoryRules: {} as RuleMap,
  focusSites: [] as string[],
  focusCategories: [] as string[],
  schedule: DEFAULT_FOCUS_SCHEDULE as FocusSchedule,
  manualFocus: false,
  usage: {} as DailyUsage,
  timeSpent: {} as DailyUsage
}

function checkPermanentBlock(url: string, now: Date): boolean {
  const hostname = extractHostname(url)
  if (!hostname) return false
  const today = todayKey(now)

  for (const [domain, rule] of Object.entries(state.siteRules)) {
    if (!matchesSite(hostname, domain)) continue
    if (!ruleApplies(rule, now)) continue
    const usage = getUsage(state.usage, today, siteUsageKey(domain))
    if (isOverLimit(rule, usage)) return true
  }

  for (const [catId, rule] of Object.entries(state.categoryRules)) {
    if (!ruleApplies(rule, now)) continue
    const cat = categoryById(catId)
    if (!cat) continue
    if (!cat.domains.some((d) => matchesSite(hostname, d))) continue
    const usage = getUsage(state.usage, today, categoryUsageKey(catId))
    if (isOverLimit(rule, usage)) return true
  }

  return false
}

function checkFocusBlock(url: string, now: Date): boolean {
  const focusOn = state.manualFocus || isFocusActive(state.schedule, now)
  if (!focusOn) return false
  const set = new Set<string>(state.focusSites)
  for (const d of domainsForCategories(state.focusCategories)) set.add(d)
  if (set.size === 0) return false
  return isBlockedUrl(url, Array.from(set))
}

function shouldRedirect(url: string, now: Date): boolean {
  if (url.startsWith(chrome.runtime.getURL(""))) return false
  return checkPermanentBlock(url, now) || checkFocusBlock(url, now)
}

async function hydrate() {
  const [
    rawSites,
    rawCategories,
    focusSites,
    focusCategories,
    schedule,
    manualFocus,
    usage,
    timeSpent
  ] = await Promise.all([
    storage.get(BLOCKED_SITES_KEY),
    storage.get(BLOCKED_CATEGORIES_KEY),
    storage.get<string[]>(FOCUS_SITES_KEY),
    storage.get<string[]>(FOCUS_CATEGORIES_KEY),
    storage.get<FocusSchedule>(FOCUS_SCHEDULE_KEY),
    storage.get<boolean>(FOCUS_MODE_KEY),
    storage.get<DailyUsage>(USAGE_KEY),
    storage.get<DailyUsage>(TIME_SPENT_KEY)
  ])
  state.siteRules = migrateRules(rawSites)
  state.categoryRules = migrateRules(rawCategories)
  state.focusSites = focusSites ?? []
  state.focusCategories = focusCategories ?? []
  state.schedule = schedule ?? DEFAULT_FOCUS_SCHEDULE
  state.manualFocus = manualFocus ?? false
  state.usage = usage ?? {}
  state.timeSpent = timeSpent ?? {}

  if (Array.isArray(rawSites)) {
    await storage.set(BLOCKED_SITES_KEY, state.siteRules)
  }
  if (Array.isArray(rawCategories)) {
    await storage.set(BLOCKED_CATEGORIES_KEY, state.categoryRules)
  }
}

storage.watch({
  [BLOCKED_SITES_KEY]: (c) => {
    state.siteRules = migrateRules(c.newValue)
  },
  [BLOCKED_CATEGORIES_KEY]: (c) => {
    state.categoryRules = migrateRules(c.newValue)
  },
  [FOCUS_SITES_KEY]: (c) => {
    state.focusSites = (c.newValue as string[]) ?? []
  },
  [FOCUS_CATEGORIES_KEY]: (c) => {
    state.focusCategories = (c.newValue as string[]) ?? []
  },
  [FOCUS_SCHEDULE_KEY]: (c) => {
    state.schedule = (c.newValue as FocusSchedule) ?? DEFAULT_FOCUS_SCHEDULE
  },
  [FOCUS_MODE_KEY]: (c) => {
    state.manualFocus = (c.newValue as boolean) ?? false
  },
  [USAGE_KEY]: (c) => {
    state.usage = (c.newValue as DailyUsage) ?? {}
  },
  [TIME_SPENT_KEY]: (c) => {
    state.timeSpent = (c.newValue as DailyUsage) ?? {}
  }
})

function blockedPageUrl(originalUrl: string): string {
  const params = new URLSearchParams({ url: originalUrl })
  return chrome.runtime.getURL(`tabs/blocked.html?${params.toString()}`)
}

async function recordBlock(url: string) {
  const event: BlockEvent = {
    host: extractHostname(url),
    timestamp: Date.now()
  }
  const events = (await storage.get<BlockEvent[]>(BLOCK_EVENTS_KEY)) ?? []
  await storage.set(BLOCK_EVENTS_KEY, [...events, event].slice(-MAX_EVENTS))
}

const hydrated = hydrate()

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return
  await hydrated
  if (!shouldRedirect(details.url, new Date())) return
  recordBlock(details.url)
  chrome.tabs.update(details.tabId, { url: blockedPageUrl(details.url) })
})

chrome.alarms.create(TICK_ALARM, { periodInMinutes: 1 })

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== TICK_ALARM) return
  await hydrated
  await tickUsage()
})

async function tickUsage() {
  const tabs = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  })
  const tab = tabs[0]
  if (!tab?.url || tab.id == null) return

  const url = tab.url
  if (!url.startsWith("http://") && !url.startsWith("https://")) return
  if (url.startsWith(chrome.runtime.getURL(""))) return

  const hostname = extractHostname(url)
  if (!hostname) return

  const now = new Date()
  const today = todayKey(now)

  let nextTime = withIncrement(state.timeSpent, today, hostname)
  nextTime = pruneUsage(nextTime, now, TIME_SPENT_RETENTION_DAYS)
  state.timeSpent = nextTime
  await storage.set(TIME_SPENT_KEY, nextTime)

  let nextUsage = state.usage
  let dirty = false

  for (const [domain, rule] of Object.entries(state.siteRules)) {
    if (rule.dailyLimitMinutes === null) continue
    if (!matchesSite(hostname, domain)) continue
    if (!ruleApplies(rule, now)) continue
    nextUsage = withIncrement(nextUsage, today, siteUsageKey(domain))
    dirty = true
  }

  for (const [catId, rule] of Object.entries(state.categoryRules)) {
    if (rule.dailyLimitMinutes === null) continue
    if (!ruleApplies(rule, now)) continue
    const cat = categoryById(catId)
    if (!cat) continue
    if (!cat.domains.some((d) => matchesSite(hostname, d))) continue
    nextUsage = withIncrement(nextUsage, today, categoryUsageKey(catId))
    dirty = true
  }

  if (!dirty) return

  nextUsage = pruneUsage(nextUsage, now)
  state.usage = nextUsage
  await storage.set(USAGE_KEY, nextUsage)

  if (shouldRedirect(url, now)) {
    chrome.tabs.update(tab.id, { url: blockedPageUrl(url) })
  }
}
