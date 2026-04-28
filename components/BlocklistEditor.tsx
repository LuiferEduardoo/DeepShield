import CategoryCard from "~components/CategoryCard"
import SectionTitle from "~components/SectionTitle"
import SiteEditor from "~components/SiteEditor"
import { CATEGORIES } from "~lib/categories"
import { colors } from "~lib/theme"

interface BlocklistEditorProps {
  sites: string[]
  onSitesChange: (sites: string[]) => void
  categories: string[]
  onCategoriesChange: (categories: string[]) => void
}

function BlocklistEditor({
  sites,
  onSitesChange,
  categories,
  onCategoriesChange
}: BlocklistEditorProps) {
  const toggleCategory = (id: string) => {
    if (categories.includes(id)) {
      onCategoriesChange(categories.filter((c) => c !== id))
    } else {
      onCategoriesChange([...categories, id])
    }
  }

  return (
    <>
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
              active={categories.includes(cat.id)}
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
        <SiteEditor sites={sites} onChange={onSitesChange} />
      </section>
    </>
  )
}

export default BlocklistEditor
