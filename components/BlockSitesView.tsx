import { useMemo } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import RuleBlocklistEditor from "~components/RuleBlocklistEditor"
import {
  BLOCKED_CATEGORIES_KEY,
  BLOCKED_SITES_KEY,
  migrateRules,
  type RuleMap
} from "~lib/blocking"
import { colors } from "~lib/theme"

function BlockSitesView() {
  const [rawSites, setRawSites] = useStorage<unknown>(BLOCKED_SITES_KEY, {})
  const [rawCategories, setRawCategories] = useStorage<unknown>(
    BLOCKED_CATEGORIES_KEY,
    {}
  )
  const siteRules = useMemo(() => migrateRules(rawSites), [rawSites])
  const categoryRules = useMemo(
    () => migrateRules(rawCategories),
    [rawCategories]
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
          Configura días y tiempo límite por sitio o categoría.
        </p>
      </header>

      <RuleBlocklistEditor
        siteRules={siteRules}
        onSiteRulesChange={(r: RuleMap) => setRawSites(r)}
        categoryRules={categoryRules}
        onCategoryRulesChange={(r: RuleMap) => setRawCategories(r)}
      />
    </>
  )
}

export default BlockSitesView
