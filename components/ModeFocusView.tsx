import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import BlocklistEditor from "~components/BlocklistEditor"
import ScheduleEditor from "~components/ScheduleEditor"
import SectionTitle from "~components/SectionTitle"
import { FOCUS_MODE_KEY } from "~lib/blocking"
import {
  DEFAULT_FOCUS_SCHEDULE,
  FOCUS_CATEGORIES_KEY,
  FOCUS_SCHEDULE_KEY,
  FOCUS_SITES_KEY,
  formatMinutes,
  isFocusActive,
  type FocusSchedule
} from "~lib/focus"
import { colors } from "~lib/theme"

const TICK_MS = 60_000

function ModeFocusView() {
  const [sites, setSites] = useStorage<string[]>(FOCUS_SITES_KEY, [])
  const [categories, setCategories] = useStorage<string[]>(
    FOCUS_CATEGORIES_KEY,
    []
  )
  const [schedule, setSchedule] = useStorage<FocusSchedule>(
    FOCUS_SCHEDULE_KEY,
    DEFAULT_FOCUS_SCHEDULE
  )
  const [manualFocus] = useStorage<boolean>(FOCUS_MODE_KEY, false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), TICK_MS)
    return () => clearInterval(id)
  }, [])

  const sched = schedule ?? DEFAULT_FOCUS_SCHEDULE
  const scheduled = isFocusActive(sched, now)
  const active = !!manualFocus || scheduled

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16
        }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
            Modo focus
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: colors.muted,
              lineHeight: 1.5
            }}>
            Bloqueo programado por días y horario. Se activa solo durante el
            rango configurado.
          </p>
        </div>
        <StatusPill
          active={active}
          manual={!!manualFocus}
          schedule={sched}
        />
      </header>

      <section style={{ marginTop: 24 }}>
        <SectionTitle>Programación</SectionTitle>
        <ScheduleEditor schedule={sched} onChange={setSchedule} />
      </section>

      <BlocklistEditor
        sites={sites ?? []}
        onSitesChange={setSites}
        categories={categories ?? []}
        onCategoriesChange={setCategories}
      />
    </>
  )
}

function StatusPill({
  active,
  manual,
  schedule
}: {
  active: boolean
  manual: boolean
  schedule: FocusSchedule
}) {
  const label = manual
    ? "Activo (manual)"
    : active
      ? "Activo ahora"
      : `${formatMinutes(schedule.startMinutes)} – ${formatMinutes(schedule.endMinutes)}`
  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        background: active ? colors.success : colors.surfaceAlt,
        color: active ? "#0b1f17" : colors.muted,
        whiteSpace: "nowrap"
      }}>
      {label}
    </span>
  )
}

export default ModeFocusView
