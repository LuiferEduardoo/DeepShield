import { Storage } from "@plasmohq/storage"

import type { BlockEvent } from "~lib/blocking"
import {
  BLOCKED_CATEGORIES_KEY,
  BLOCKED_SITES_KEY,
  BLOCK_EVENTS_KEY,
  extractHostname,
  FOCUS_MODE_KEY,
  isBlockedUrl,
  MAX_EVENTS
} from "~lib/blocking"
import { domainsForCategories } from "~lib/categories"
import {
  DEFAULT_FOCUS_SCHEDULE,
  FOCUS_CATEGORIES_KEY,
  FOCUS_SCHEDULE_KEY,
  FOCUS_SITES_KEY,
  isFocusActive,
  type FocusSchedule
} from "~lib/focus"

const storage = new Storage()

const state = {
  customSites: [] as string[],
  categories: [] as string[],
  focusSites: [] as string[],
  focusCategories: [] as string[],
  schedule: DEFAULT_FOCUS_SCHEDULE as FocusSchedule,
  manualFocus: false
}

function effectiveSites(): string[] {
  const set = new Set<string>(state.customSites)
  for (const d of domainsForCategories(state.categories)) set.add(d)
  const focusOn =
    state.manualFocus || isFocusActive(state.schedule, new Date())
  if (focusOn) {
    for (const s of state.focusSites) set.add(s)
    for (const d of domainsForCategories(state.focusCategories)) set.add(d)
  }
  return Array.from(set)
}

async function hydrate() {
  const [
    customSites,
    categories,
    focusSites,
    focusCategories,
    schedule,
    manualFocus
  ] = await Promise.all([
    storage.get<string[]>(BLOCKED_SITES_KEY),
    storage.get<string[]>(BLOCKED_CATEGORIES_KEY),
    storage.get<string[]>(FOCUS_SITES_KEY),
    storage.get<string[]>(FOCUS_CATEGORIES_KEY),
    storage.get<FocusSchedule>(FOCUS_SCHEDULE_KEY),
    storage.get<boolean>(FOCUS_MODE_KEY)
  ])
  state.customSites = customSites ?? []
  state.categories = categories ?? []
  state.focusSites = focusSites ?? []
  state.focusCategories = focusCategories ?? []
  state.schedule = schedule ?? DEFAULT_FOCUS_SCHEDULE
  state.manualFocus = manualFocus ?? false
}

storage.watch({
  [BLOCKED_SITES_KEY]: (c) => {
    state.customSites = (c.newValue as string[]) ?? []
  },
  [BLOCKED_CATEGORIES_KEY]: (c) => {
    state.categories = (c.newValue as string[]) ?? []
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
  }
})

function shouldRedirect(url: string): boolean {
  if (url.startsWith(chrome.runtime.getURL(""))) return false
  const sites = effectiveSites()
  if (sites.length === 0) return false
  return isBlockedUrl(url, sites)
}

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

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return
  if (!shouldRedirect(details.url)) return
  recordBlock(details.url)
  chrome.tabs.update(details.tabId, { url: blockedPageUrl(details.url) })
})

hydrate()
