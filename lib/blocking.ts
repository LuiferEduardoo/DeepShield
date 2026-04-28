export const BLOCKED_SITES_KEY = "blocked-sites"
export const FOCUS_MODE_KEY = "focus-mode"
export const BLOCK_EVENTS_KEY = "block-events"
export const MAX_EVENTS = 500

export interface BlockEvent {
  host: string
  timestamp: number
}

export function normalizeSite(input: string): string {
  let value = input.trim().toLowerCase()
  if (!value) return ""
  value = value.replace(/^https?:\/\//, "")
  value = value.replace(/^www\./, "")
  value = value.split("/")[0]
  value = value.split(":")[0]
  return value
}

export function isValidSite(site: string): boolean {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(site)
}

export function matchesSite(hostname: string, site: string): boolean {
  if (!site) return false
  const host = hostname.toLowerCase().replace(/^www\./, "")
  return host === site || host.endsWith("." + site)
}

export function isBlockedUrl(url: string, sites: string[]): boolean {
  let hostname: string
  try {
    hostname = new URL(url).hostname
  } catch {
    return false
  }
  return sites.some((s) => matchesSite(hostname, s))
}

export function extractHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}
