import { useState } from "react"

import {
  defaultCustomPeriod,
  PERIOD_PRESETS,
  type Period,
  type PeriodKind
} from "~lib/period"
import { colors, fontFamily, radii } from "~lib/theme"

interface PeriodPickerProps {
  value: Period
  onChange: (period: Period) => void
}

function PeriodPicker({ value, onChange }: PeriodPickerProps) {
  const selectPreset = (kind: PeriodKind) => {
    if (kind === "custom") onChange(defaultCustomPeriod())
    else onChange({ kind })
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {PERIOD_PRESETS.map((preset) => (
          <Pill
            key={preset.kind}
            label={preset.label}
            active={value.kind === preset.kind}
            onClick={() => selectPreset(preset.kind)}
          />
        ))}
        <Pill
          label="Personalizado"
          active={value.kind === "custom"}
          onClick={() => selectPreset("custom")}
        />
      </div>
      {value.kind === "custom" ? (
        <CustomRange
          from={value.from ?? ""}
          to={value.to ?? ""}
          onChange={(from, to) => onChange({ kind: "custom", from, to })}
        />
      ) : null}
    </div>
  )
}

function Pill({
  label,
  active,
  onClick
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  const background = active
    ? colors.accent
    : hover
      ? colors.surfaceAlt
      : colors.surface
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-pressed={active}
      style={{
        padding: "7px 14px",
        borderRadius: 999,
        border: "none",
        background,
        color: active ? "#fff" : colors.text,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 120ms ease"
      }}>
      {label}
    </button>
  )
}

function CustomRange({
  from,
  to,
  onChange
}: {
  from: string
  to: string
  onChange: (from: string, to: string) => void
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap"
      }}>
      <DateField
        label="Desde"
        value={from}
        onChange={(v) => onChange(v, to)}
      />
      <DateField label="Hasta" value={to} onChange={(v) => onChange(from, v)} />
    </div>
  )
}

function DateField({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, color: colors.muted }}>{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px 10px",
          borderRadius: radii.sm,
          border: "none",
          background: colors.surface,
          color: colors.text,
          fontSize: 13,
          fontFamily,
          colorScheme: "dark"
        }}
      />
    </label>
  )
}

export default PeriodPicker
