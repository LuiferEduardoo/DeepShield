import type { BlockEvent } from "~lib/blocking"

const DAY_MS = 24 * 60 * 60 * 1000

export function startOfDay(timestamp: number): number {
  const d = new Date(timestamp)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function countSince(events: BlockEvent[], since: number): number {
  return events.reduce((n, e) => (e.timestamp >= since ? n + 1 : n), 0)
}

export function countToday(events: BlockEvent[], now = Date.now()): number {
  return countSince(events, startOfDay(now))
}

export function countLastDays(
  events: BlockEvent[],
  days: number,
  now = Date.now()
): number {
  return countSince(events, now - days * DAY_MS)
}

export interface HostCount {
  host: string
  count: number
}

export function topHosts(events: BlockEvent[], limit: number): HostCount[] {
  const counts = new Map<string, number>()
  for (const e of events) {
    counts.set(e.host, (counts.get(e.host) ?? 0) + 1)
  }
  return Array.from(counts, ([host, count]) => ({ host, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function recentEvents(
  events: BlockEvent[],
  limit: number
): BlockEvent[] {
  return [...events]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
}

export function formatRelative(timestamp: number, now = Date.now()): string {
  const diff = Math.max(0, now - timestamp)
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return "hace un momento"
  const min = Math.floor(sec / 60)
  if (min < 60) return `hace ${min} min`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `hace ${hr} h`
  const day = Math.floor(hr / 24)
  if (day < 7) return `hace ${day} d`
  return new Date(timestamp).toLocaleDateString()
}
