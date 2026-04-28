import { useState } from "react"

import { faviconUrl } from "~lib/favicon"
import { colors, radii } from "~lib/theme"

interface FaviconProps {
  domain: string
  size?: number
}

function Favicon({ domain, size = 20 }: FaviconProps) {
  const [errored, setErrored] = useState(false)
  const initial = (domain[0] ?? "?").toUpperCase()

  if (errored) {
    return (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: radii.sm,
          background: colors.surfaceAlt,
          color: colors.muted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: Math.round(size * 0.55),
          fontWeight: 600,
          flexShrink: 0
        }}>
        {initial}
      </span>
    )
  }

  return (
    <img
      src={faviconUrl(domain, 64)}
      alt=""
      width={size}
      height={size}
      onError={() => setErrored(true)}
      style={{
        borderRadius: radii.sm,
        display: "block",
        flexShrink: 0
      }}
    />
  )
}

export default Favicon
