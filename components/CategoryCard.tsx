import { useState } from "react"

import type { Category } from "~lib/categories"
import { colors, radii } from "~lib/theme"

interface CategoryCardProps {
  category: Category
  active: boolean
  subtitle?: React.ReactNode
  onToggle: () => void
}

function CategoryCard({
  category,
  active,
  subtitle,
  onToggle
}: CategoryCardProps) {
  const [hover, setHover] = useState(false)
  const background = active
    ? colors.accentSoft
    : hover
      ? colors.surfaceAlt
      : colors.surface

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-pressed={active}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
        padding: "14px 16px",
        borderRadius: radii.lg,
        border: "none",
        background,
        color: colors.text,
        textAlign: "left",
        cursor: "pointer",
        transition: "background 120ms ease"
      }}>
      <span style={{ fontSize: 26, lineHeight: 1 }}>{category.emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{category.label}</span>
      {subtitle !== undefined ? (
        typeof subtitle === "string" ? (
          <span style={{ fontSize: 11, color: colors.muted }}>{subtitle}</span>
        ) : (
          subtitle
        )
      ) : (
        <span style={{ fontSize: 11, color: colors.muted }}>
          {category.domains.length} sitios
        </span>
      )}
      <ActiveIndicator active={active} />
    </button>
  )
}

function ActiveIndicator({ active }: { active: boolean }) {
  return (
    <span
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        width: 18,
        height: 18,
        borderRadius: 999,
        background: active ? colors.accent : colors.surfaceAlt,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 120ms ease"
      }}>
      {active ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12l5 5 9-11"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  )
}

export default CategoryCard
