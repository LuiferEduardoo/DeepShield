import { useState } from "react"

import Favicon from "~components/Favicon"
import { isValidSite, normalizeSite } from "~lib/blocking"
import { colors, fontFamily, radii } from "~lib/theme"

interface SiteEditorProps {
  sites: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}

function SiteEditor({ sites, onChange, placeholder }: SiteEditorProps) {
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const addSite = () => {
    const candidate = normalizeSite(input)
    if (!candidate) return setError("Escribe un dominio.")
    if (!isValidSite(candidate)) {
      return setError("Formato inválido. Ej: youtube.com")
    }
    if (sites.includes(candidate)) {
      return setError("Ese sitio ya está en la lista.")
    }
    onChange([...sites, candidate])
    setInput("")
    setError(null)
  }

  const removeSite = (site: string) => {
    onChange(sites.filter((s) => s !== site))
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            if (error) setError(null)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") addSite()
          }}
          placeholder={placeholder ?? "ej: youtube.com"}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: radii.md,
            background: colors.surface,
            border: error ? "1px solid #f87171" : "none",
            color: colors.text,
            fontSize: 13,
            fontFamily
          }}
        />
        <AddButton onClick={addSite} />
      </div>
      {error ? (
        <div style={{ color: "#f87171", fontSize: 12, marginTop: 6 }}>
          {error}
        </div>
      ) : null}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "12px 0 0",
          display: "flex",
          flexDirection: "column",
          gap: 6
        }}>
        {sites.length === 0 ? (
          <Empty />
        ) : (
          sites.map((site) => (
            <SiteRow
              key={site}
              site={site}
              onRemove={() => removeSite(site)}
            />
          ))
        )}
      </ul>
    </div>
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
        gap: 12,
        padding: "10px 14px",
        borderRadius: radii.md,
        background: hover ? colors.surfaceAlt : colors.surface,
        transition: "background 120ms ease"
      }}>
      <Favicon domain={site} size={20} />
      <span style={{ flex: 1, fontSize: 13 }}>{site}</span>
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

function Empty() {
  return (
    <li
      style={{
        padding: 20,
        textAlign: "center",
        color: colors.muted,
        fontSize: 13,
        background: colors.surface,
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

export default SiteEditor
