import { useState } from "react"

import { colors, fontFamily, radii } from "~lib/theme"

export interface SidebarItemDef {
  id: string
  label: string
  icon: React.ReactNode
}

interface SidebarProps {
  items: SidebarItemDef[]
  activeId: string
  onSelect: (id: string) => void
}

function Sidebar({ items, activeId, onSelect }: SidebarProps) {
  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        padding: "24px 12px",
        background: colors.surface,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        fontFamily
      }}>
      <Logo />
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={item.id === activeId}
            onClick={() => onSelect(item.id)}
          />
        ))}
      </nav>
    </aside>
  )
}

function SidebarItem({
  item,
  active,
  onClick
}: {
  item: SidebarItemDef
  active: boolean
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  const background = active
    ? colors.accentSoft
    : hover
      ? colors.surfaceAlt
      : "transparent"
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        borderRadius: radii.md,
        border: "none",
        background,
        color: active ? colors.text : colors.muted,
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        textAlign: "left",
        transition: "background 120ms ease, color 120ms ease"
      }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          color: active ? colors.accent : "inherit"
        }}>
        {item.icon}
      </span>
      {item.label}
    </button>
  )
}

function Logo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 12px"
      }}>
      <ShieldLogo />
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 0.2,
          color: colors.text
        }}>
        DeepShield
      </span>
    </div>
  )
}

function ShieldLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="sb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.accent} />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l8 3v6c0 5-3.5 8.6-8 10-4.5-1.4-8-5-8-10v-6l8-3z"
        fill="url(#sb)"
      />
      <path
        d="M9 12.2l2.2 2.2L15 10.6"
        stroke={colors.surface}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default Sidebar
