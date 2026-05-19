import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import warningGif from "url:~assets/cat-warning.gif"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_idle"
}

const AUTO_HIDE_MS = 55_000

interface WarningMessage {
  type: "focus-warning"
  text: string
}

function isWarningMessage(value: unknown): value is WarningMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { type?: unknown }).type === "focus-warning"
  )
}

function FocusWarning() {
  const [data, setData] = useState<WarningMessage | null>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    const handler = (message: unknown) => {
      if (!isWarningMessage(message)) return
      setData(message)
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => setData(null), AUTO_HIDE_MS)
    }
    chrome.runtime.onMessage.addListener(handler)
    return () => {
      chrome.runtime.onMessage.removeListener(handler)
      if (timer) clearTimeout(timer)
    }
  }, [])

  if (!data) return null

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 2147483647,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 10,
        pointerEvents: "none",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
      <div
        style={{
          background: "rgba(15, 17, 21, 0.92)",
          color: "#ececf1",
          padding: "10px 14px",
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 500,
          maxWidth: 220,
          textAlign: "right",
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.35)"
        }}>
        {data.text}
      </div>
      <img
        src={warningGif}
        alt=""
        style={{
          width: 180,
          height: "auto",
          display: "block",
          background: "transparent",
          filter: "drop-shadow(0 6px 24px rgba(0, 0, 0, 0.35))"
        }}
      />
    </div>
  )
}

export default FocusWarning
