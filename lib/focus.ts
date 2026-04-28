export const FOCUS_SITES_KEY = "focus-sites"
export const FOCUS_CATEGORIES_KEY = "focus-categories"
export const FOCUS_SCHEDULE_KEY = "focus-schedule"

export interface FocusSchedule {
  days: number[]
  startMinutes: number
  endMinutes: number
}

export const DEFAULT_FOCUS_SCHEDULE: FocusSchedule = {
  days: [1, 2, 3, 4, 5],
  startMinutes: 9 * 60,
  endMinutes: 17 * 60
}

export interface DayDef {
  idx: number
  label: string
}

export const DAYS_ORDER: readonly DayDef[] = [
  { idx: 1, label: "L" },
  { idx: 2, label: "M" },
  { idx: 3, label: "X" },
  { idx: 4, label: "J" },
  { idx: 5, label: "V" },
  { idx: 6, label: "S" },
  { idx: 0, label: "D" }
]

export function formatMinutes(m: number): string {
  const h = Math.floor(m / 60)
    .toString()
    .padStart(2, "0")
  const min = (m % 60).toString().padStart(2, "0")
  return `${h}:${min}`
}

export function parseTime(value: string): number {
  const [h, m] = value.split(":").map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

export function isFocusActive(schedule: FocusSchedule, now: Date): boolean {
  if (!schedule.days.includes(now.getDay())) return false
  if (schedule.startMinutes === schedule.endMinutes) return false
  const minutes = now.getHours() * 60 + now.getMinutes()
  if (schedule.startMinutes < schedule.endMinutes) {
    return minutes >= schedule.startMinutes && minutes < schedule.endMinutes
  }
  return minutes >= schedule.startMinutes || minutes < schedule.endMinutes
}
