import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import {
  BLOCKED_SITES_KEY,
  isValidSite,
  normalizeSite
} from "~lib/blocking"
import { colors, fontFamily, radii } from "~lib/theme"

function BlockedSitesPage() {
  const [sites, setSites] = useStorage<string[]>(BLOCKED_SITES_KEY, [])
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const list = sites ?? []

  const addSite = () => {
    const candidate = normalizeSite(input)
    if (!candidate) {
      setError("Escribe un dominio.")
      return
    }
    if (!isValidSite(candidate)) {
      setError("Formato inválido. Ej: youtube.com")
      return
    }
    if (list.includes(candidate)) {
      setError("Ese sitio ya está en la lista.")
      return
    }
    setSites([...list, candidate])
    setInput("")
    setError(null)
  }

  const removeSite = (site: string) => {
    setSites(list.filter((s) => s !== site))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addSite()
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily,
        padding: "32px 16px"
      }}>
      <section style={{ maxWidth: 560, margin: "0 auto" }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            Sitios bloqueados
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              color: colors.muted,
              fontSize: 13,
              lineHeight: 1.5
            }}>
            Estos dominios se bloquean cuando el modo focus está activo.
            Coincide con subdominios automáticamente.
          </p>
        </header>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={onKeyDown}
            placeholder="ej: youtube.com"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: radii.md,
              background: colors.surface,
              border: `1px solid ${error ? "#f87171" : colors.border}`,
              color: colors.text,
              fontSize: 13,
              outline: "none",
              fontFamily
            }}
          />
          <AddButton onClick={addSite} />
        </div>
        {error ? (
          <div style={{ color: "#f87171", fontSize: 12, marginBottom: 12 }}>
            {error}
          </div>
        ) : null}

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "16px 0 0",
            display: "flex",
            flexDirection: "column",
            gap: 6
          }}>
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            list.map((site) => (
              <SiteRow
                key={site}
                site={site}
                onRemove={() => removeSite(site)}
              />
            ))
          )}
        </ul>
      </section>
    </main>
  )
}

function SiteRow({
  site,
  onRemove
}: {
  site: string
  onRemove: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        borderRadius: radii.md,
        background: hover ? colors.surfaceAlt : colors.surface,
        border: `1px solid ${colors.border}`,
        transition: "background 120ms ease"
      }}>
      <span style={{ fontSize: 13 }}>{site}</span>
      <button
        onClick={onRemove}
        aria-label={`Eliminar ${site}`}
        style={{
          background: "transparent",
          border: "none",
          color: colors.muted,
          cursor: "pointer",
          padding: 6,
          borderRadius: 6,
          display: "flex",
          alignItems: "center"
        }}>
        <TrashIcon />
      </button>
    </li>
  )
}

function AddButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "10px 16px",
        borderRadius: radii.md,
        border: "none",
        background: hover ? colors.accentSoft : colors.accent,
        color: "#fff",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 120ms ease"
      }}>
      Añadir
    </button>
  )
}

function EmptyState() {
  return (
    <li
      style={{
        padding: "24px",
        textAlign: "center",
        color: colors.muted,
        fontSize: 13,
        background: colors.surface,
        border: `1px dashed ${colors.border}`,
        borderRadius: radii.md
      }}>
      Aún no has añadido sitios.
    </li>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default BlockedSitesPage
