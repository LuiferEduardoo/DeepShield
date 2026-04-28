import { useEffect, useState } from "react"

import DaysSelector from "~components/DaysSelector"
import type { BlockRule } from "~lib/blocking"
import { colors, fontFamily, radii } from "~lib/theme"

interface RuleDialogProps {
  open: boolean
  title: string
  initial?: BlockRule | null
  showRemove?: boolean
  onClose: () => void
  onSave: (rule: BlockRule) => void
  onRemove?: () => void
}

function RuleDialog({
  open,
  title,
  initial,
  showRemove,
  onClose,
  onSave,
  onRemove
}: RuleDialogProps) {
  const [days, setDays] = useState<number[]>([])
  const [hasLimit, setHasLimit] = useState(false)
  const [minutes, setMinutes] = useState<number>(30)

  useEffect(() => {
    if (!open) return
    setDays(initial?.days ?? [])
    setHasLimit(initial?.dailyLimitMinutes != null)
    setMinutes(initial?.dailyLimitMinutes ?? 30)
  }, [open, initial])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const save = () => {
    onSave({
      days: [...days].sort((a, b) => a - b),
      dailyLimitMinutes: hasLimit
        ? Math.max(1, Math.floor(minutes || 1))
        : null
    })
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily
      }}>
      <div
        style={{
          background: colors.surface,
          borderRadius: radii.lg,
          padding: 24,
          width: "100%",
          maxWidth: 440,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          color: colors.text
        }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{title}</h3>

        <Field label="Días de la semana">
          <DaysSelector days={days} onChange={setDays} />
          <p style={{ margin: "8px 0 0", fontSize: 11, color: colors.muted }}>
            Vacío = todos los días.
          </p>
        </Field>

        <Field label="Tiempo límite">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Toggle on={hasLimit} onChange={setHasLimit} />
            <span style={{ fontSize: 13, color: colors.muted }}>
              {hasLimit
                ? "Permitir tiempo al día"
                : "Sin límite (bloquear siempre)"}
            </span>
          </div>
          {hasLimit ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 12
              }}>
              <input
                type="number"
                min={1}
                max={1440}
                value={minutes}
                onChange={(e) =>
                  setMinutes(parseInt(e.target.value, 10) || 1)
                }
                style={{
                  width: 80,
                  padding: "8px 10px",
                  borderRadius: radii.sm,
                  border: "none",
                  background: colors.bg,
                  color: colors.text,
                  fontSize: 13,
                  fontFamily
                }}
              />
              <span style={{ fontSize: 13, color: colors.muted }}>
                min/día
              </span>
            </div>
          ) : null}
        </Field>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            marginTop: 4
          }}>
          <div>
            {showRemove && onRemove ? (
              <DialogButton danger onClick={onRemove}>
                Quitar
              </DialogButton>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <DialogButton onClick={onClose}>Cancelar</DialogButton>
            <DialogButton primary onClick={save}>
              Guardar
            </DialogButton>
          </div>
        </div>
      </div>
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

function Toggle({
  on,
  onChange
}: {
  on: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      style={{
        width: 38,
        height: 22,
        borderRadius: 999,
        border: "none",
        background: on ? colors.accent : colors.surfaceAlt,
        position: "relative",
        cursor: "pointer",
        transition: "background 150ms ease",
        padding: 0,
        flexShrink: 0
      }}>
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 19 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 150ms ease"
        }}
      />
    </button>
  )
}

function DialogButton({
  children,
  onClick,
  primary,
  danger
}: {
  children: React.ReactNode
  onClick: () => void
  primary?: boolean
  danger?: boolean
}) {
  const [hover, setHover] = useState(false)
  const bg = primary
    ? hover
      ? colors.accentSoft
      : colors.accent
    : danger
      ? hover
        ? "#3a1f23"
        : "transparent"
      : hover
        ? colors.surfaceAlt
        : "transparent"
  const color = primary ? "#fff" : danger ? "#f87171" : colors.text
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "9px 16px",
        borderRadius: radii.md,
        border: "none",
        background: bg,
        color,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 120ms ease"
      }}>
      {children}
    </button>
  )
}

export default RuleDialog
