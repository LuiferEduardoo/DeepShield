export const USAGE_KEY = "site-usage"

export type DailyUsage = Record<string, Record<string, number>>

export function todayKey(now: Date): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function siteUsageKey(domain: string): string {
  return `site:${domain}`
}

export function categoryUsageKey(id: string): string {
  return `category:${id}`
}

export function getUsage(
  usage: DailyUsage,
  day: string,
  key: string
): number {
  return usage[day]?.[key] ?? 0
}

export function withIncrement(
  usage: DailyUsage,
  day: string,
  key: string,
  by = 1
): DailyUsage {
  const dayMap = { ...(usage[day] ?? {}) }
  dayMap[key] = (dayMap[key] ?? 0) + by
  return { ...usage, [day]: dayMap }
}

export function pruneUsage(
  usage: DailyUsage,
  now: Date,
  daysToKeep = 30
): DailyUsage {
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - daysToKeep)
  const cutoffKey = todayKey(cutoff)
  const next: DailyUsage = {}
  for (const [day, map] of Object.entries(usage)) {
    if (day >= cutoffKey) next[day] = map
  }
  return next
}
