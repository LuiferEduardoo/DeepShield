import { useStorage } from "@plasmohq/storage/hook"

import SiteEditor from "~components/SiteEditor"
import { BLOCKED_SITES_KEY } from "~lib/blocking"
import { colors, fontFamily } from "~lib/theme"

import "../style.css"

function BlockedSitesPage() {
  const [sites, setSites] = useStorage<string[]>(BLOCKED_SITES_KEY, [])

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

        <SiteEditor sites={sites ?? []} onChange={setSites} />
      </section>
    </main>
  )
}

export default BlockedSitesPage
