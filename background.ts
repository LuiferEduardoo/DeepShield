import { Storage } from "@plasmohq/storage"

import type { BlockEvent } from "~lib/blocking"
import {
  BLOCKED_CATEGORIES_KEY,
  BLOCKED_SITES_KEY,
  BLOCK_EVENTS_KEY,
  extractHostname,
  isBlockedUrl,
  MAX_EVENTS
} from "~lib/blocking"
import { domainsForCategories } from "~lib/categories"

const storage = new Storage()

const state = {
  customSites: [] as string[],
  categories: [] as string[]
}

function effectiveSites(): string[] {
  const set = new Set<string>(state.customSites)
  for (const d of domainsForCategories(state.categories)) set.add(d)
  return Array.from(set)
}

async function hydrate() {
  const [customSites, categories] = await Promise.all([
    storage.get<string[]>(BLOCKED_SITES_KEY),
    storage.get<string[]>(BLOCKED_CATEGORIES_KEY)
  ])
  state.customSites = customSites ?? []
  state.categories = categories ?? []
}

storage.watch({
  [BLOCKED_SITES_KEY]: (c) => {
    state.customSites = (c.newValue as string[]) ?? []
  },
  [BLOCKED_CATEGORIES_KEY]: (c) => {
    state.categories = (c.newValue as string[]) ?? []
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
