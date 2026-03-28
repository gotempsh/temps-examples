# Astro Portfolio Example

A developer portfolio / landing page built with **Astro** and **Tailwind CSS v4**.

## What

Static portfolio site showcasing Astro's component model, Tailwind v4's `@import "tailwindcss"` syntax with oklch colors, and static SVG asset handling. Uses an emerald/teal color palette with light and dark mode support.

## Run

```bash
bun install
bun run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Build

```bash
bun run build
```

Outputs static files to `dist/`.

Preview the production build locally:

```bash
bun run preview
```

## Key Patterns

- **Astro components** (`.astro`) with frontmatter props via `---` fences
- **Tailwind CSS v4** integrated through `@tailwindcss/vite` plugin
- **Static assets** served from `public/` (images, favicon) and `src/assets/` (imported assets)
- **Layout composition** with `<slot />` for content projection
- **Island architecture** — zero JS shipped by default; interactive islands opt-in with `client:*` directives
- **Dark mode** via CSS class toggle with `localStorage` persistence
