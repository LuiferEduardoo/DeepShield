import { useState } from "react"

const colors = {
  bg: "#0f1115",
  surface: "#171a21",
  surfaceAlt: "#1f242e",
  border: "#262b36",
  text: "#ececf1",
  muted: "#9098a8",
  accent: "#7c5cff",
  accentSoft: "#3a2f7a",
  success: "#34d399"
}

function IndexPopup() {
  const [focusOn, setFocusOn] = useState(false)

  const openDashboard = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("tabs/dashboard.html") })
  }

  const openSettings = () => {
    chrome.runtime.openOptionsPage()
  }

  const openBlockedSites = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("tabs/blocked-sites.html")
    })
  }

  return (
    <div
      style={{
        width: 320,
        background: colors.bg,
        color: colors.text,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        margin: 0
      }}>
      <header
        style={{
          padding: "18px 18px 14px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          gap: 12,
          alignItems: "flex-start"
        }}>
        <ShieldIcon />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2 }}>
            DeepShield
          </span>
          <span
            style={{
              fontSize: 12,
              color: colors.muted,
              lineHeight: 1.4
            }}>
            Es hora de concentrarte en lo que realmente importa. Tu tiempo es
            el recurso más valioso.
          </span>
        </div>
      </header>

      <section
        style={{
          padding: "14px 18px 4px",
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
        <PrimaryButton
          onClick={() => setFocusOn((v) => !v)}
          active={focusOn}>
          <FocusIcon />
          {focusOn ? "Modo focus activo" : "Modo focus"}
        </PrimaryButton>

        <SecondaryButton onClick={openBlockedSites}>
          <ListIcon />
          Editar sitios bloqueados
        </SecondaryButton>
      </section>

      <nav
        style={{
          marginTop: 10,
          borderTop: `1px solid ${colors.border}`,
          padding: "10px 10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}>
        <NavLink
          label="Dashboard"
          description="Estadísticas y tu progreso"
          onClick={openDashboard}
          icon={<DashboardIcon />}
        />
        <NavLink
          label="Configuración"
          description="Reglas, horarios y preferencias"
          onClick={openSettings}
          icon={<GearIcon />}
        />
      </nav>
    </div>
  )
}

function PrimaryButton({
  children,
  onClick,
  active
}: {
  children: React.ReactNode
  onClick: () => void
  active: boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        padding: "11px 14px",
        borderRadius: 10,
        border: "none",
        background: active
          ? colors.success
          : hover
            ? colors.accentSoft
            : colors.accent,
        color: active ? "#0b1f17" : "#fff",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 120ms ease"
      }}>
      {children}
    </button>
  )
}

function SecondaryButton({
  children,
  onClick
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        background: hover ? colors.surfaceAlt : colors.surface,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 120ms ease"
      }}>
      {children}
    </button>
  )
}

function NavLink({
  label,
  description,
  onClick,
  icon
}: {
  label: string
  description: string
  onClick: () => void
  icon: React.ReactNode
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        background: hover ? colors.surfaceAlt : "transparent",
        border: "none",
        borderRadius: 10,
        padding: "10px 12px",
        cursor: "pointer",
        color: colors.text,
        textAlign: "left",
        transition: "background 120ms ease"
      }}>
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.accent
        }}>
        {icon}
      </span>
      <span style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 11, color: colors.muted }}>{description}</span>
      </span>
      <ChevronIcon />
    </button>
  )
}

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="dsg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c5cff" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l8 3v6c0 5-3.5 8.6-8 10-4.5-1.4-8-5-8-10v-6l8-3z"
        fill="url(#dsg)"
      />
      <path
        d="M9 12.2l2.2 2.2L15 10.6"
        stroke="#0f1115"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function FocusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6h16M4 12h16M4 18h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 13h7V4H4v9zm0 7h7v-5H4v5zm9 0h7v-9h-7v9zm0-16v5h7V4h-7z"
        fill="currentColor"
      />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M19.14 12.94a7.96 7.96 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.86 7.86 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.55-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.96 7.96 0 0 0 0 1.88L2.83 14.52a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.49.39 1.03.7 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54a7.86 7.86 0 0 0 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
        fill="currentColor"
      />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6l6 6-6 6"
        stroke={colors.muted}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IndexPopup
