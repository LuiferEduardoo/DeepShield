import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import StatCard from "~components/StatCard"
import type { BlockEvent } from "~lib/blocking"
import {
  BLOCKED_SITES_KEY,
  BLOCK_EVENTS_KEY,
  FOCUS_MODE_KEY
} from "~lib/blocking"
import {
  countLastDays,
  countToday,
  formatRelative,
  recentEvents,
  topHosts,
  type HostCount
} from "~lib/stats"
import { colors, fontFamily, radii } from "~lib/theme"

const RECENT_LIMIT = 8
const TOP_LIMIT = 5

function DashboardPage() {
  const [events, setEvents] = useStorage<BlockEvent[]>(BLOCK_EVENTS_KEY, [])
  const [sites] = useStorage<string[]>(BLOCKED_SITES_KEY, [])
  const [focusOn] = useStorage<boolean>(FOCUS_MODE_KEY, false)

  const all = events ?? []
  const today = countToday(all)
  const week = countLastDays(all, 7)
  const total = all.length
  const top = topHosts(all, TOP_LIMIT)
  const recent = recentEvents(all, RECENT_LIMIT)

  return (
    <main
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily,
        padding: "32px 16px"
      }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Header focusOn={!!focusOn} sitesCount={(sites ?? []).length} />

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginTop: 20
          }}>
          <StatCard label="Hoy" value={today} hint="bloqueos" />
          <StatCard label="Últimos 7 días" value={week} hint="bloqueos" />
          <StatCard label="Total" value={total} hint="histórico" />
        </section>

        <section style={{ marginTop: 24 }}>
          <SectionTitle>Sitios más bloqueados</SectionTitle>
          {top.length === 0 ? (
            <EmptyCard message="Sin datos todavía. Activa el modo focus y empieza a navegar." />
          ) : (
            <div
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: radii.lg,
                padding: 8,
                display: "flex",
                flexDirection: "column",
                gap: 2
              }}>
              {top.map((row) => (
                <HostBar key={row.host} row={row} max={top[0].count} />
              ))}
            </div>
          )}
        </section>

        <section style={{ marginTop: 24 }}>
          <SectionTitle>Actividad reciente</SectionTitle>
          {recent.length === 0 ? (
            <EmptyCard message="Aún no hay actividad registrada." />
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 6
              }}>
              {recent.map((e) => (
                <EventRow key={e.timestamp} event={e} />
              ))}
            </ul>
          )}
        </section>

        {total > 0 ? (
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <ClearButton onClick={() => setEvents([])} />
          </div>
        ) : null}
      </div>
    </main>
  )
}

function Header({
  focusOn,
  sitesCount
}: {
  focusOn: boolean
  sitesCount: number
}) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16
      }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: colors.muted,
            lineHeight: 1.5
          }}>
          Tu actividad de DeepShield. {sitesCount} sitios en la lista.
        </p>
      </div>
      <StatusPill on={focusOn} />
    </header>
  )
}

function StatusPill({ on }: { on: boolean }) {
  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: on ? colors.success : colors.surfaceAlt,
        color: on ? "#0b1f17" : colors.muted,
        border: `1px solid ${on ? colors.success : colors.border}`,
        whiteSpace: "nowrap"
      }}>
      {on ? "Modo focus activo" : "Modo focus inactivo"}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: "0 0 10px",
        fontSize: 13,
        fontWeight: 600,
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.6
      }}>
      {children}
    </h2>
  )
}

function HostBar({ row, max }: { row: HostCount; max: number }) {
  const pct = Math.max(6, Math.round((row.count / max) * 100))
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: radii.md,
        position: "relative"
      }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          margin: 4,
          width: `calc(${pct}% - 8px)`,
          background: colors.accentSoft,
          borderRadius: radii.sm,
          opacity: 0.5
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13
        }}>
        <span style={{ fontWeight: 500 }}>{row.host}</span>
        <span style={{ color: colors.muted, fontVariantNumeric: "tabular-nums" }}>
          {row.count}
        </span>
      </div>
    </div>
  )
}

function EventRow({ event }: { event: BlockEvent }) {
  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 14px",
        borderRadius: radii.md,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        fontSize: 13
      }}>
      <span>{event.host}</span>
      <span style={{ color: colors.muted, fontSize: 12 }}>
        {formatRelative(event.timestamp)}
      </span>
    </li>
  )
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        color: colors.muted,
        fontSize: 13,
        background: colors.surface,
        border: `1px dashed ${colors.border}`,
        borderRadius: radii.md
      }}>
      {message}
    </div>
  )
}

function ClearButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "8px 14px",
        borderRadius: radii.md,
        background: hover ? colors.surfaceAlt : "transparent",
        border: `1px solid ${colors.border}`,
        color: colors.muted,
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 120ms ease"
      }}>
      Limpiar historial
    </button>
  )
}

export default DashboardPage
