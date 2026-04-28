import { colors } from "~lib/theme"

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

export default SectionTitle
