import { useEffect, useState } from "react"

import BlockSitesView from "~components/BlockSitesView"
import HomeView from "~components/HomeView"
import ModeFocusView from "~components/ModeFocusView"
import Sidebar, { type SidebarItemDef } from "~components/Sidebar"
import { colors, fontFamily } from "~lib/theme"

import "../style.css"

type ViewId = "home" | "blocks" | "focus"

const NAV_ITEMS: SidebarItemDef[] = [
  { id: "home", label: "Inicio", icon: <HomeIcon /> },
  { id: "blocks", label: "Bloquear sitios", icon: <ShieldIcon /> },
  { id: "focus", label: "Modo focus", icon: <ClockIcon /> }
]

function readHash(): ViewId {
  if (typeof window === "undefined") return "home"
  const hash = window.location.hash.slice(1)
  if (hash === "blocks" || hash === "focus") return hash
  return "home"
}

function DashboardPage() {
  const [view, setView] = useState<ViewId>(readHash)

  useEffect(() => {
    const onChange = () => setView(readHash())
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])

  const select = (id: string) => {
    window.location.hash = id
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily
      }}>
      <Sidebar items={NAV_ITEMS} activeId={view} onSelect={select} />
      <main style={{ flex: 1, padding: "32px 32px", overflow: "auto" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {view === "home" ? (
            <HomeView />
          ) : view === "blocks" ? (
            <BlockSitesView />
          ) : (
            <ModeFocusView />
          )}
        </div>
      </main>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H10v7H6a2 2 0 0 1-2-2v-9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l8 3v6c0 5-3.5 8.6-8 10-4.5-1.4-8-5-8-10V6l8-3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default DashboardPage
