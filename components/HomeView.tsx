import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import SectionTitle from "~components/SectionTitle"
import StatCard from "~components/StatCard"
import type { BlockEvent } from "~lib/blocking"
import { BLOCK_EVENTS_KEY } from "~lib/blocking"
import {
  countLastDays,
  countToday,
  formatRelative,
  recentEvents,
  topHosts,
  type HostCount
} from "~lib/stats"
import {
  formatDuration,
  TIME_SPENT_KEY,
  topByTime,
  totalMinutes,
  type DailyUsage,
  type DomainTime
} from "~lib/usage"
import { colors, radii } from "~lib/theme"

const RECENT_LIMIT = 8
const TOP_LIMIT = 5

function HomeView() {
  const [events, setEvents] = useStorage<BlockEvent[]>(BLOCK_EVENTS_KEY, [])
  const [timeSpent] = useStorage<DailyUsage>(TIME_SPENT_KEY, {})
  const all = events ?? []
  const today = countToday(all)
  const week = countLastDays(all, 7)
  const total = all.length
  const top = topHosts(all, TOP_LIMIT)
  const recent = recentEvents(all, RECENT_LIMIT)
  const time = timeSpent ?? {}
  const topTime = topByTime(time, TOP_LIMIT)
  const totalTime = totalMinutes(time)

  return (
    <>
      <header>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Inicio</h1>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: colors.muted,
            lineHeight: 1.5
          }}>
          Resumen de tu actividad de DeepShield.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginTop: 20
        }}>
        <StatCard label="Hoy" value={today} hint="bloqueos" />
        <StatCard label="Últimos 7 días" value={week} hint="bloqueos" />
        <StatCard label="Total" value={total} hint="histórico" />
        <StatCard
          label="Tiempo navegado"
          value={formatDuration(totalTime)}
          hint="histórico"
        />
      </section>

      <section style={{ marginTop: 28 }}>
        <SectionTitle>Tiempo en páginas</SectionTitle>
        <p
          style={{
            margin: "-4px 0 12px",
            fontSize: 12,
            color: colors.muted
          }}>
          Dominios donde más tiempo has pasado (histórico).
        </p>
        {topTime.length === 0 ? (
          <EmptyCard message="Aún no hay tiempo registrado. Navega un poco y vuelve." />
        ) : (
          <div
            style={{
              background: colors.surface,
              borderRadius: radii.lg,
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}>
            {topTime.map((row) => (
              <TimeBar key={row.domain} row={row} max={topTime[0].minutes} />
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: 28 }}>
        <SectionTitle>Sitios más bloqueados</SectionTitle>
        {top.length === 0 ? (
          <EmptyCard message="Sin datos todavía. Añade sitios en 'Bloquear sitios' y empieza a navegar." />
        ) : (
          <div
            style={{
              background: colors.surface,
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

      <section style={{ marginTop: 28 }}>
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
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end"
          }}>
          <ClearButton onClick={() => setEvents([])} />
        </div>
      ) : null}
    </>
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
        <span
          style={{ color: colors.muted, fontVariantNumeric: "tabular-nums" }}>
          {row.count}
        </span>
      </div>
    </div>
  )
}

function TimeBar({ row, max }: { row: DomainTime; max: number }) {
  const pct = Math.max(6, Math.round((row.minutes / max) * 100))
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
        <span style={{ fontWeight: 500 }}>{row.domain}</span>
        <span
          style={{ color: colors.muted, fontVariantNumeric: "tabular-nums" }}>
          {formatDuration(row.minutes)}
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
        background: hover ? colors.surfaceAlt : colors.surface,
        border: "none",
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

export default HomeView
