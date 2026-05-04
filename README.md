# DeepShield

A Chrome MV3 browser extension that protects you from distractions and helps you understand where your time goes.

Built with [Plasmo](https://docs.plasmo.com), React 18, and TypeScript.

## What it does

- **Per-site or per-category blocking** with configurable rules: which days of the week the rule applies and, optionally, a daily time limit before blocking kicks in.
- **Predefined categories** that cover dozens of domains in one click: Social media, Video & streaming, Shopping, News, Gaming, Adult.
- **Scheduled focus mode**: a separate list of sites blocked only on specific days/hours. Can also be activated manually from the popup, ignoring the schedule.
- **Custom block page** that shows the domain you tried to visit.
- **Historical statistics** of time spent on each domain (90-day retention) and triggered blocks.
- **Quick-block** of the current site straight from the popup.

## Project structure

```
popup.tsx                 # toolbar popup
background.ts             # service worker: navigation + tracking + alarms
tabs/
  dashboard.tsx           # dashboard with sidebar (Home, Block, Focus)
  blocked.tsx             # page shown when a site is blocked
  blocked-sites.tsx       # standalone view (legacy entrypoint)
components/               # reusable UI (CategoryCard, RuleDialog, ...)
lib/
  blocking.ts             # blocking model types and helpers
  categories.ts           # predefined categories
  focus.ts                # focus-mode schedule and state
  stats.ts                # dashboard derivations
  usage.ts                # time tracking and daily limits
  theme.ts                # single source of truth for the palette
assets/                   # icons and images (including the block-page art)
```

## Data model

Persistence via [`@plasmohq/storage`](https://docs.plasmo.com/framework/storage). Main keys:

| Key | Shape | Purpose |
|---|---|---|
| `blocked-sites` | `Record<domain, BlockRule>` | Permanent per-domain blocks |
| `blocked-categories` | `Record<categoryId, BlockRule>` | Active categories |
| `focus-sites` / `focus-categories` | `string[]` | Focus-mode lists |
| `focus-schedule` | `{ days, startMinutes, endMinutes }` | Focus-mode schedule |
| `focus-mode` | `boolean` | Manual focus override |
| `block-events` | `BlockEvent[]` | Block log (capped at 500) |
| `site-usage` | `Record<date, Record<target, minutes>>` | Counter for daily limits (30-day cap) |
| `time-spent` | `Record<date, Record<domain, minutes>>` | Historical time per domain (90-day cap) |

`BlockRule = { days: number[], dailyLimitMinutes: number | null }`. An empty `days` means every day; a `null` `dailyLimitMinutes` means a hard block.

## How blocking works

`background.ts` listens to `chrome.webNavigation.onBeforeNavigate`. When the event fires:

1. State is hydrated from storage if the service worker just woke up.
2. Permanent rules are evaluated. If focus mode is active (manual or scheduled), focus rules are evaluated too.
3. If any rule blocks, the tab is redirected to `tabs/blocked.html?url=<original>`.

Time counting and limit enforcement run through `chrome.alarms` with a one-minute tick over the active tab in the last focused window.

## Permissions

Declared in `package.json#manifest`:

- `storage` — persistence in `chrome.storage.local`.
- `tabs` — read the active tab's URL for tracking and the popup.
- `webNavigation` — intercept navigations to block them.
- `alarms` — periodic usage tick.
- `host_permissions: <all_urls>` — required so `webNavigation` receives all URLs.

## Commands

```bash
npm run dev         # dev server with hot reload (loads build/chrome-mv3-dev/)
npm run build       # production build
npm run package     # produces the store-ready .zip
npx tsc --noEmit    # type-check
```

## Loading the extension in development

1. `npm run dev`
2. `chrome://extensions` → enable **Developer mode**.
3. **Load unpacked** → select `build/chrome-mv3-dev/`.
4. Changes hot-reload automatically; manifest changes sometimes require a manual reload of the extension.

## Conventions

Style and architecture rules live in [`CLAUDE.md`](./CLAUDE.md): single palette, SOLID/DRY/KISS principles, component layout, and storage abstracted in `lib/`.
