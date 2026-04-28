import { useEffect, useState } from "react"

import blockedGif from "url:~assets/200w.gif"

import { extractHostname } from "~lib/blocking"
import { colors, fontFamily, radii } from "~lib/theme"

import "../style.css"

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
        <h1
          style={{
            margin: "20px 0 8px",
            fontSize: 22,
            fontWeight: 700
          }}>
          No puedes entrar a esta página
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
        <img
          src={blockedGif}
          alt=""
          style={{
            width: "100%",
            maxWidth: 230,
            borderRadius: radii.md,
            display: "block",
            margin: "0 auto"
          }}
        />
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

export default BlockedPage
