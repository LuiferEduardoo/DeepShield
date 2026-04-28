import { useState } from "react"

import { DAYS_ORDER } from "~lib/focus"
import { colors, radii } from "~lib/theme"

interface DaysSelectorProps {
  days: number[]
  onChange: (days: number[]) => void
}

function DaysSelector({ days, onChange }: DaysSelectorProps) {
  const toggle = (day: number) => {
    const next = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day].sort((a, b) => a - b)
    onChange(next)
  }
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {DAYS_ORDER.map(({ idx, label }) => (
        <DayButton
          key={idx}
          label={label}
          active={days.includes(idx)}
          onClick={() => toggle(idx)}
        />
      ))}
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
      type="button"
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

export default DaysSelector
