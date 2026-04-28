import { Storage } from "@plasmohq/storage"

import type { BlockEvent } from "~lib/blocking"
import {
  BLOCKED_SITES_KEY,
  BLOCK_EVENTS_KEY,
  extractHostname,
  FOCUS_MODE_KEY,
  isBlockedUrl,
  MAX_EVENTS
} from "~lib/blocking"

const storage = new Storage()

const state = {
  sites: [] as string[],
  focusOn: false
}

async function hydrate() {
  const [sites, focusOn] = await Promise.all([
    storage.get<string[]>(BLOCKED_SITES_KEY),
    storage.get<boolean>(FOCUS_MODE_KEY)
  ])
  state.sites = sites ?? []
  state.focusOn = focusOn ?? false
}

storage.watch({
  [BLOCKED_SITES_KEY]: (c) => {
    state.sites = (c.newValue as string[]) ?? []
  },
  [FOCUS_MODE_KEY]: (c) => {
    state.focusOn = (c.newValue as boolean) ?? false
  }
})

function shouldRedirect(url: string): boolean {
  if (!state.focusOn) return false
  if (state.sites.length === 0) return false
  if (url.startsWith(chrome.runtime.getURL(""))) return false
  return isBlockedUrl(url, state.sites)
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
