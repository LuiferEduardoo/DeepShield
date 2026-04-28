import { useState } from "react"

import {
  DAYS_ORDER,
  formatMinutes,
  parseTime,
  type FocusSchedule
} from "~lib/focus"
import { colors, fontFamily, radii } from "~lib/theme"

interface ScheduleEditorProps {
  schedule: FocusSchedule
  onChange: (schedule: FocusSchedule) => void
}

function ScheduleEditor({ schedule, onChange }: ScheduleEditorProps) {
  const toggleDay = (day: number) => {
    const next = schedule.days.includes(day)
      ? schedule.days.filter((d) => d !== day)
      : [...schedule.days, day].sort((a, b) => a - b)
    onChange({ ...schedule, days: next })
  }

  return (
    <div
      style={{
        background: colors.surface,
        borderRadius: radii.lg,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 18
      }}>
      <Field label="Días de la semana">
        <div style={{ display: "flex", gap: 6 }}>
          {DAYS_ORDER.map(({ idx, label }) => (
            <DayButton
              key={idx}
              label={label}
              active={schedule.days.includes(idx)}
              onClick={() => toggleDay(idx)}
            />
          ))}
        </div>
      </Field>

      <Field label="Horario">
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <TimeField
            label="Inicio"
            value={formatMinutes(schedule.startMinutes)}
            onChange={(v) =>
              onChange({ ...schedule, startMinutes: parseTime(v) })
            }
          />
          <span
            style={{
              color: colors.muted,
              fontSize: 13,
              paddingBottom: 10
            }}>
            a
          </span>
          <TimeField
            label="Fin"
            value={formatMinutes(schedule.endMinutes)}
            onChange={(v) =>
              onChange({ ...schedule, endMinutes: parseTime(v) })
            }
          />
        </div>
      </Field>
    </div>
  )
}

function Field({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: colors.muted,
          textTransform: "uppercase",
          letterSpacing: 0.4
        }}>
        {label}
      </span>
      {children}
    </div>
  )
}

function DayButton({
  label,
  active,
  onClick
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-pressed={active}
      style={{
        width: 36,
        height: 36,
        borderRadius: radii.sm,
        border: "none",
        background: active
          ? colors.accent
          : hover
            ? colors.surfaceAlt
            : colors.bg,
        color: active ? "#fff" : colors.text,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 120ms ease"
      }}>
      {label}
    </button>
  )
}

function TimeField({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, color: colors.muted }}>{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px 10px",
          borderRadius: radii.sm,
          border: "none",
          background: colors.bg,
          color: colors.text,
          fontSize: 13,
          fontFamily,
          colorScheme: "dark"
        }}
      />
    </div>
  )
}

export default ScheduleEditor
