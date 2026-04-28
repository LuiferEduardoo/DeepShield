import DaysSelector from "~components/DaysSelector"
import {
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
        <DaysSelector
          days={schedule.days}
          onChange={(days) => onChange({ ...schedule, days })}
        />
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
