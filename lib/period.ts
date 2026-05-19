import { todayKey } from "~lib/usage"

export type PeriodKind = "today" | "week" | "month" | "year" | "custom"

export interface Period {
  kind: PeriodKind
  from?: string
  to?: string
}

export interface DateRange {
  fromMs: number
  toMs: number
}

export interface PeriodPreset {
  kind: Exclude<PeriodKind, "custom">
  label: string
}

export const PERIOD_PRESETS: PeriodPreset[] = [
  { kind: "today", label: "Hoy" },
  { kind: "week", label: "Última semana" },
  { kind: "month", label: "Último mes" },
  { kind: "year", label: "Último año" }
]

const DAY_MS = 24 * 60 * 60 * 1000

function startOfDay(date: Date): Date {
  const r = new Date(date)
  r.setHours(0, 0, 0, 0)
  return r
}

function endOfDay(date: Date): Date {
  const r = new Date(date)
  r.setHours(23, 59, 59, 999)
  return r
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1)
}

export function resolveRange(period: Period, now = new Date()): DateRange {
  const todayEnd = endOfDay(now).getTime()
  switch (period.kind) {
    case "today":
      return { fromMs: startOfDay(now).getTime(), toMs: todayEnd }
    case "week":
      return {
        fromMs: startOfDay(new Date(now.getTime() - 6 * DAY_MS)).getTime(),
        toMs: todayEnd
      }
    case "month":
      return {
        fromMs: startOfDay(new Date(now.getTime() - 29 * DAY_MS)).getTime(),
        toMs: todayEnd
      }
    case "year":
      return {
        fromMs: startOfDay(new Date(now.getTime() - 364 * DAY_MS)).getTime(),
        toMs: todayEnd
      }
    case "custom": {
      const fromKey = period.from ?? todayKey(now)
      const toKey = period.to ?? fromKey
      const [a, b] =
        fromKey <= toKey ? [fromKey, toKey] : [toKey, fromKey]
      return {
        fromMs: startOfDay(parseDateKey(a)).getTime(),
        toMs: endOfDay(parseDateKey(b)).getTime()
      }
    }
  }
}

export function periodLabel(period: Period): string {
  if (period.kind !== "custom") {
    return PERIOD_PRESETS.find((p) => p.kind === period.kind)?.label ?? ""
  }
  const from = period.from ?? ""
  const to = period.to ?? ""
  if (from === to) return from
  return `${from} – ${to}`
}

export function defaultCustomPeriod(now = new Date()): Period {
  const today = todayKey(now)
  return { kind: "custom", from: today, to: today }
}
