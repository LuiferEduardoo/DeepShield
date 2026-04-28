export function faviconUrl(domain: string, size = 64): string {
  const cleaned = domain.replace(/^https?:\/\//, "").split("/")[0]
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleaned)}&sz=${size}`
}
