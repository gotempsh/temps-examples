# SvelteKit Fullstack Example

A fullstack SvelteKit application with Tailwind CSS v4, SSR, and static assets.

## Stack

- **SvelteKit** with Svelte 5 runes (`$state()`, `$props()`, `{@render}`)
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin and oklch color palette
- **Server-side rendering** via `+page.server.ts` load functions
- **TypeScript** end-to-end
- **Static assets** (SVG images served from `static/`)

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
bun run build
bun run preview
```

## Key Patterns

- **Svelte 5 runes**: `$state()` for reactive state, `$props()` for component props
- **Server load functions**: Data fetched in `+page.server.ts` and consumed via `let { data } = $props()`
- **Tailwind v4**: Uses `@import "tailwindcss"` syntax with `@theme inline` and CSS custom properties
- **Dark mode**: Toggle via `$state()` rune, applies `.dark` class to `<html>`
- **Static images**: SVGs in `static/` directory, referenced as `/images/...`
