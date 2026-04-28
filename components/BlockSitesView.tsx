import { useStorage } from "@plasmohq/storage/hook"

import CategoryCard from "~components/CategoryCard"
import SiteEditor from "~components/SiteEditor"
import {
  BLOCKED_CATEGORIES_KEY,
  BLOCKED_SITES_KEY
} from "~lib/blocking"
import { CATEGORIES } from "~lib/categories"
import { colors } from "~lib/theme"

function BlockSitesView() {
  const [sites, setSites] = useStorage<string[]>(BLOCKED_SITES_KEY, [])
  const [activeCategories, setActiveCategories] = useStorage<string[]>(
    BLOCKED_CATEGORIES_KEY,
    []
  )
  const customSites = sites ?? []
  const activeIds = activeCategories ?? []

  const toggleCategory = (id: string) => {
    if (activeIds.includes(id)) {
      setActiveCategories(activeIds.filter((c) => c !== id))
    } else {
      setActiveCategories([...activeIds, id])
    }
  }

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

      <section style={{ marginTop: 24 }}>
        <SectionTitle>Categorías</SectionTitle>
        <p
          style={{
            margin: "-4px 0 12px",
            fontSize: 12,
            color: colors.muted
          }}>
          Activa una categoría para bloquear todos sus sitios al instante.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 10
          }}>
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              active={activeIds.includes(cat.id)}
              onToggle={() => toggleCategory(cat.id)}
            />
          ))}
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <SectionTitle>Sitios personalizados</SectionTitle>
        <p
          style={{
            margin: "-4px 0 12px",
            fontSize: 12,
            color: colors.muted
          }}>
          Añade dominios específicos. Coincide con subdominios automáticamente.
        </p>
        <SiteEditor sites={customSites} onChange={setSites} />
      </section>
    </>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: "0 0 10px",
        fontSize: 13,
        fontWeight: 600,
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.6
      }}>
      {children}
    </h2>
  )
}

export default BlockSitesView
