import { colors, radii } from "~lib/theme"

interface StatCardProps {
  label: string
  value: string | number
  hint?: string
}

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div
      style={{
        background: colors.surface,
        borderRadius: radii.lg,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 4
      }}>
      <span style={{ fontSize: 12, color: colors.muted }}>{label}</span>
      <span style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>
        {value}
      </span>
      {hint ? (
        <span style={{ fontSize: 11, color: colors.muted }}>{hint}</span>
      ) : null}
    </div>
  )
}

export default StatCard
