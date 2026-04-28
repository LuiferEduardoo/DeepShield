import BlockSitesView from "~components/BlockSitesView"
import { colors, fontFamily } from "~lib/theme"

import "../style.css"

function BlockedSitesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily,
        padding: "32px 16px"
      }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <BlockSitesView />
      </div>
    </main>
  )
}

export default BlockedSitesPage
