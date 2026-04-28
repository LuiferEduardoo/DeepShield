export const USAGE_KEY = "site-usage"
export const TIME_SPENT_KEY = "time-spent"
export const TIME_SPENT_RETENTION_DAYS = 90

export type DailyUsage = Record<string, Record<string, number>>

export interface DomainTime {
  domain: string
  minutes: number
}

export function topByTime(usage: DailyUsage, limit: number): DomainTime[] {
  const totals = new Map<string, number>()
  for (const dayMap of Object.values(usage)) {
    for (const [domain, minutes] of Object.entries(dayMap)) {
      totals.set(domain, (totals.get(domain) ?? 0) + minutes)
    }
  }
  return Array.from(totals, ([domain, minutes]) => ({ domain, minutes }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, limit)
}

export function totalMinutes(usage: DailyUsage): number {
  let total = 0
  for (const dayMap of Object.values(usage)) {
    for (const minutes of Object.values(dayMap)) total += minutes
  }
  return total
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return "< 1 min"
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

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
