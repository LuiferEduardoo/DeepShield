import { useState } from "react"

import CategoryCard from "~components/CategoryCard"
import Favicon from "~components/Favicon"
import RuleDialog from "~components/RuleDialog"
import SectionTitle from "~components/SectionTitle"
import {
  type BlockRule,
  DEFAULT_RULE,
  isValidSite,
  normalizeSite,
  type RuleMap
} from "~lib/blocking"
import { CATEGORIES, categoryById } from "~lib/categories"
import { DAYS_ORDER } from "~lib/focus"
import { colors, fontFamily, radii } from "~lib/theme"

interface RuleBlocklistEditorProps {
  siteRules: RuleMap
  onSiteRulesChange: (rules: RuleMap) => void
  categoryRules: RuleMap
  onCategoryRulesChange: (rules: RuleMap) => void
}

type DialogState =
  | { kind: "site"; domain: string; existing: BlockRule | null }
  | { kind: "category"; categoryId: string; existing: BlockRule | null }
  | null

function RuleBlocklistEditor({
  siteRules,
  onSiteRulesChange,
  categoryRules,
  onCategoryRulesChange
}: RuleBlocklistEditorProps) {
  const [dialog, setDialog] = useState<DialogState>(null)
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const tryAddSite = () => {
    const candidate = normalizeSite(input)
    if (!candidate) return setError("Escribe un dominio.")
    if (!isValidSite(candidate))
      return setError("Formato inválido. Ej: youtube.com")
    if (candidate in siteRules)
      return setError("Ese sitio ya está en la lista.")
    setError(null)
    setDialog({ kind: "site", domain: candidate, existing: null })
  }

  const onSave = (rule: BlockRule) => {
    if (!dialog) return
    if (dialog.kind === "site") {
      onSiteRulesChange({ ...siteRules, [dialog.domain]: rule })
      if (!dialog.existing) setInput("")
    } else {
      onCategoryRulesChange({ ...categoryRules, [dialog.categoryId]: rule })
    }
    setDialog(null)
  }

  const onRemove = () => {
    if (!dialog || !dialog.existing) return
    if (dialog.kind === "site") {
      const next = { ...siteRules }
      delete next[dialog.domain]
      onSiteRulesChange(next)
    } else {
      const next = { ...categoryRules }
      delete next[dialog.categoryId]
      onCategoryRulesChange(next)
    }
    setDialog(null)
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
          Activa una categoría y define los días y tiempo límite.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 10
          }}>
          {CATEGORIES.map((cat) => {
            const rule = categoryRules[cat.id]
            const subtitle = rule ? (
              <RuleSummary rule={rule} />
            ) : (
              `${cat.domains.length} sitios`
            )
            return (
              <CategoryCard
                key={cat.id}
                category={cat}
                active={!!rule}
                subtitle={subtitle}
                onToggle={() =>
                  setDialog({
                    kind: "category",
                    categoryId: cat.id,
                    existing: rule ?? null
                  })
                }
              />
            )
          })}
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

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") tryAddSite()
            }}
            placeholder="ej: youtube.com"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: radii.md,
              background: colors.surface,
              border: error ? "1px solid #f87171" : "none",
              color: colors.text,
              fontSize: 13,
              fontFamily
            }}
          />
          <AddButton onClick={tryAddSite} />
        </div>
        {error ? (
          <div style={{ color: "#f87171", fontSize: 12, marginTop: 6 }}>
            {error}
          </div>
        ) : null}

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "12px 0 0",
            display: "flex",
            flexDirection: "column",
            gap: 6
          }}>
          {Object.keys(siteRules).length === 0 ? (
            <Empty />
          ) : (
            Object.entries(siteRules)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([domain, rule]) => (
                <SiteRuleRow
                  key={domain}
                  domain={domain}
                  rule={rule}
                  onClick={() =>
                    setDialog({
                      kind: "site",
                      domain,
                      existing: rule
                    })
                  }
                />
              ))
          )}
        </ul>
      </section>

      <RuleDialog
        open={dialog !== null}
        title={dialogTitle(dialog)}
        initial={dialog?.existing ?? DEFAULT_RULE}
        showRemove={!!dialog?.existing}
        onClose={() => setDialog(null)}
        onSave={onSave}
        onRemove={onRemove}
      />
    </>
  )
}

function dialogTitle(dialog: DialogState): string {
  if (!dialog) return ""
  if (dialog.kind === "site") {
    return dialog.existing
      ? `Editar ${dialog.domain}`
      : `Bloquear ${dialog.domain}`
  }
  const cat = categoryById(dialog.categoryId)
  const label = cat?.label ?? dialog.categoryId
  return dialog.existing ? `Editar ${label}` : `Bloquear ${label}`
}

function SiteRuleRow({
  domain,
  rule,
  onClick
}: {
  domain: string
  rule: BlockRule
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  return (
    <li>
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          borderRadius: radii.md,
          background: hover ? colors.surfaceAlt : colors.surface,
          border: "none",
          color: colors.text,
          textAlign: "left",
          cursor: "pointer",
          transition: "background 120ms ease",
          fontFamily
        }}>
        <Favicon domain={domain} size={20} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{domain}</span>
          <RuleSummary rule={rule} />
        </div>
      </button>
    </li>
  )
}

export function RuleSummary({ rule }: { rule: BlockRule }) {
  const dayLabel =
    rule.days.length === 0 || rule.days.length === 7
      ? "Todos los días"
      : DAYS_ORDER.filter((d) => rule.days.includes(d.idx))
          .map((d) => d.label)
          .join(" ")
  const limitLabel =
    rule.dailyLimitMinutes === null
      ? "Sin límite"
      : `${rule.dailyLimitMinutes} min/día`
  return (
    <span style={{ fontSize: 11, color: colors.muted }}>
      {dayLabel} · {limitLabel}
    </span>
  )
}

function AddButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "10px 16px",
        borderRadius: radii.md,
        border: "none",
        background: hover ? colors.accentSoft : colors.accent,
        color: "#fff",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 120ms ease"
      }}>
      Añadir
    </button>
  )
}

function Empty() {
  return (
    <li
      style={{
        padding: 20,
        textAlign: "center",
        color: colors.muted,
        fontSize: 13,
        background: colors.surface,
        borderRadius: radii.md
      }}>
      Aún no has añadido sitios.
    </li>
  )
}

export default RuleBlocklistEditor
