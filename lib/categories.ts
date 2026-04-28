export interface Category {
  id: string
  label: string
  emoji: string
  domains: string[]
}

export const CATEGORIES: Category[] = [
  {
    id: "social",
    label: "Redes sociales",
    emoji: "💬",
    domains: [
      "facebook.com",
      "instagram.com",
      "twitter.com",
      "x.com",
      "tiktok.com",
      "snapchat.com",
      "reddit.com",
      "linkedin.com",
      "threads.net",
      "pinterest.com"
    ]
  },
  {
    id: "video",
    label: "Video y streaming",
    emoji: "🎬",
    domains: [
      "youtube.com",
      "netflix.com",
      "twitch.tv",
      "hulu.com",
      "disneyplus.com",
      "primevideo.com",
      "hbomax.com",
      "max.com"
    ]
  },
  {
    id: "shopping",
    label: "Shopping",
    emoji: "🛒",
    domains: [
      "amazon.com",
      "ebay.com",
      "aliexpress.com",
      "shein.com",
      "temu.com",
      "mercadolibre.com",
      "etsy.com"
    ]
  },
  {
    id: "news",
    label: "Noticias",
    emoji: "📰",
    domains: [
      "cnn.com",
      "bbc.com",
      "foxnews.com",
      "nytimes.com",
      "elpais.com",
      "elmundo.es",
      "clarin.com"
    ]
  },
  {
    id: "gaming",
    label: "Juegos",
    emoji: "🎮",
    domains: [
      "steampowered.com",
      "epicgames.com",
      "roblox.com",
      "ign.com",
      "kotaku.com"
    ]
  },
  {
    id: "adult",
    label: "Adulto",
    emoji: "🔞",
    domains: [
      "pornhub.com",
      "xvideos.com",
      "xnxx.com",
      "redtube.com",
      "youporn.com",
      "onlyfans.com"
    ]
  }
]

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id)
}

export function domainsForCategories(activeIds: string[]): string[] {
  const set = new Set<string>()
  for (const id of activeIds) {
    const cat = categoryById(id)
    if (!cat) continue
    for (const d of cat.domains) set.add(d)
  }
  return Array.from(set)
}
