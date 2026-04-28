import { useStorage } from "@plasmohq/storage/hook"

import BlocklistEditor from "~components/BlocklistEditor"
import {
  BLOCKED_CATEGORIES_KEY,
  BLOCKED_SITES_KEY
} from "~lib/blocking"
import { colors } from "~lib/theme"

function BlockSitesView() {
  const [sites, setSites] = useStorage<string[]>(BLOCKED_SITES_KEY, [])
  const [categories, setCategories] = useStorage<string[]>(
    BLOCKED_CATEGORIES_KEY,
    []
  )

  return (
    <>
      <header>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
          Bloquear sitios
        </h1>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: colors.muted,
            lineHeight: 1.5
          }}>
          Estos sitios están bloqueados de forma permanente.
        </p>
      </header>

      <BlocklistEditor
        sites={sites ?? []}
        onSitesChange={setSites}
        categories={categories ?? []}
        onCategoriesChange={setCategories}
      />
    </>
  )
}

export default BlockSitesView
