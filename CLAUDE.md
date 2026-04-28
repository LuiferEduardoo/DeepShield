# DeepShield

Extensión de navegador (Plasmo + React + TypeScript) enfocada en productividad: modo focus, bloqueo de sitios y métricas de uso.

## Stack

- **Framework:** [Plasmo](https://docs.plasmo.com) `0.90.5`
- **UI:** React 18 + TypeScript 5.3
- **Targets:** Chrome MV3 (`npm run dev` carga `build/chrome-mv3-dev/`)

## Convenciones de Plasmo

- `popup.tsx` → popup de la barra de herramientas.
- `options.tsx` → página de opciones (`chrome.runtime.openOptionsPage()`).
- `tabs/*.tsx` → páginas independientes accesibles vía `chrome.runtime.getURL("tabs/<nombre>.html")`.
- `background.ts` → service worker.
- `contents/*.ts` → content scripts.
- Para storage compartido entre vistas usar `@plasmohq/storage` con el hook `useStorage`.

## Diseño visual

**Paleta única — toda la UI debe consumir estos tokens, nunca hardcodear hex sueltos en componentes:**

```ts
const colors = {
  bg: "#0f1115",
  surface: "#171a21",
  surfaceAlt: "#1f242e",
  border: "#262b36",
  text: "#ececf1",
  muted: "#9098a8",
  accent: "#7c5cff",
  accentSoft: "#3a2f7a",
  success: "#34d399"
}
```

Reglas de uso:

- `bg` → fondo de página/popup. `surface` → tarjetas y bloques. `surfaceAlt` → estado hover/elevado.
- `border` → todos los bordes y separadores.
- `text` → tipografía principal. `muted` → descripciones, labels, iconos secundarios.
- `accent` → acción primaria (botón principal, iconos activos). `accentSoft` → hover de `accent`.
- `success` → estados positivos/activos (focus on, protegido).
- Nuevo color **solo** si ningún token cubre el caso; añadirlo aquí antes de usarlo.
- Centralizar la paleta en un único módulo (`lib/theme.ts`) en cuanto haya >1 vista importándola — no duplicar el objeto.

Tipografía y espaciado:

- Familia: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
- Radios: 8 (chips/iconos), 10 (botones), 12 (cards).
- Padding base: múltiplos de 4 (8, 10, 12, 14, 16, 18).

## Principios de código

- **Clean code:** nombres descriptivos, funciones cortas y con una sola responsabilidad, sin código muerto.
- **SOLID** aplicado al frontend:
  - *SRP* — un componente, una intención. Si un componente renderiza Y maneja lógica de red Y deriva estado complejo, sepáralo (presentational vs container, o extrae un hook).
  - *OCP* — los componentes se extienden vía props/composición, no editando su interior para casos especiales.
  - *LSP* — los componentes que comparten una "forma" (`Button`, `IconButton`, `LinkButton`) deben aceptar las mismas props base sin sorpresas.
  - *ISP* — props mínimas y específicas; evita aceptar un objeto gigante si solo usas dos campos.
  - *DIP* — la UI no habla directo con `chrome.*`; pasa por una capa (`lib/storage.ts`, `lib/tabs.ts`) que pueda mockearse en tests.
- **DRY:** si copias-pegas un bloque de JSX o estilos por segunda vez, extrae componente o helper. La paleta y los iconos viven en un solo sitio.
- **KISS:** prefiere la solución directa. No añadas estado, contextos, abstracciones ni librerías que no resuelvan un problema concreto del momento.
- **Componentes:** la UI se compone de piezas pequeñas y reutilizables (`PrimaryButton`, `NavLink`, `Stat`, `Toggle`, `Icon*`). Cada archivo expone un solo componente público; los auxiliares quedan privados al módulo.

## Estructura de archivos sugerida

A medida que crezca el proyecto, organizar así (no crear carpetas vacías por anticipado):

```
popup.tsx
options.tsx
background.ts
tabs/
  dashboard.tsx
  blocked-sites.tsx
contents/
components/      # componentes reutilizables (Button, NavLink, Toggle, Stat...)
  icons/         # SVGs como componentes
lib/             # lógica pura y wrappers de chrome.*
  theme.ts       # paleta y tokens
  storage.ts     # wrapper de @plasmohq/storage
hooks/           # hooks compartidos
```

## Estilos

Por ahora se usan estilos inline tipados con la paleta. Si la cantidad de estilos repetidos crece, migrar a CSS Modules o Tailwind (Plasmo soporta ambos sin configuración extra) — pero solo cuando duela el inline, no antes.

## Comandos

```bash
npm run dev       # dev server con hot-reload
npm run build     # build de producción
npm run package   # genera el .zip para la store
npx tsc --noEmit  # type-check sin emitir
```

## Reglas para Claude al editar este proyecto

- Reutilizar `colors.*` en todo estilo. No introducir hex literales en componentes.
- Antes de crear un componente nuevo, comprobar si uno existente cubre el caso (extiende vía props).
- Mantener componentes <150 líneas; si crece más, dividir.
- No envolver `chrome.*` con try/catch defensivos sin causa — si una API puede faltar, abstraer en `lib/`.
- No añadir comentarios que describan *qué* hace el código; solo *por qué* cuando no es obvio.
- Type-check (`npx tsc --noEmit`) debe pasar antes de dar una tarea por terminada.
