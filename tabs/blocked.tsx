import { useEffect, useState } from "react"

import { extractHostname } from "~lib/blocking"
import { colors, fontFamily, radii } from "~lib/theme"

function BlockedPage() {
  const [host, setHost] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const url = params.get("url") ?? ""
    setHost(extractHostname(url))
    document.title = "Bloqueado · DeepShield"
  }, [])

  const goBack = () => {
    if (window.history.length > 1) window.history.back()
    else window.close()
  }

  const openSettings = () => {
    chrome.tabs.update({
      url: chrome.runtime.getURL("tabs/blocked-sites.html")
    })
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24
      }}>
      <section
        style={{
          width: "100%",
          maxWidth: 480,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.lg,
          padding: 32,
          textAlign: "center"
        }}>
        <Crest />
        <h1
          style={{
            margin: "16px 0 8px",
            fontSize: 22,
            fontWeight: 700
          }}>
          Sitio bloqueado
        </h1>
        <p
          style={{
            margin: 0,
            color: colors.muted,
            fontSize: 14,
            lineHeight: 1.5
          }}>
          DeepShield está protegiendo tu enfoque. Tu tiempo es el recurso más
          valioso.
        </p>

        {host ? (
          <div
            style={{
              marginTop: 20,
              padding: "10px 14px",
              borderRadius: radii.md,
              background: colors.surfaceAlt,
              border: `1px solid ${colors.border}`,
              fontSize: 13,
              color: colors.text,
              wordBreak: "break-all"
            }}>
            {host}
          </div>
        ) : null}

        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 8,
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
          <ActionButton primary onClick={goBack}>
            Volver
          </ActionButton>
        </div>
      </section>
    </main>
  )
}

function ActionButton({
  children,
  onClick,
  primary = false
}: {
  children: React.ReactNode
  onClick: () => void
  primary?: boolean
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "10px 18px",
        borderRadius: radii.md,
        border: primary ? "none" : `1px solid ${colors.border}`,
        background: primary
          ? hover
            ? colors.accentSoft
            : colors.accent
          : hover
            ? colors.surfaceAlt
            : "transparent",
        color: primary ? "#fff" : colors.text,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 120ms ease"
      }}>
      {children}
    </button>
  )
}

function Crest() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="bp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.accent} />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l8 3v6c0 5-3.5 8.6-8 10-4.5-1.4-8-5-8-10v-6l8-3z"
        fill="url(#bp)"
      />
      <path
        d="M9 12.2l2.2 2.2L15 10.6"
        stroke={colors.bg}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default BlockedPage
