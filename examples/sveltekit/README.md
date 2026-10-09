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
PORT=3000 HOST=0.0.0.0 bun run start
```

The Node adapter writes the production server to `build/`. Temps detects this
as a SvelteKit server application and uses the `start` script to run that output.
`bun run preview` is available for local previewing of a build.

For other SvelteKit projects using `adapter-auto`, choose an adapter that matches
your deployment target. Temps runs a Node server: install
`@sveltejs/adapter-node`, use it in `svelte.config.js`, and add
`"start": "node build"` to your package scripts. The auto adapter only produces a
runnable server when it recognizes the target platform; a Vite preview command
does not replace a production server.

## Key Patterns

- **Svelte 5 runes**: `$state()` for reactive state, `$props()` for component props
- **Server load functions**: Data fetched in `+page.server.ts` and consumed via `let { data } = $props()`
- **Tailwind v4**: Uses `@import "tailwindcss"` syntax with `@theme inline` and CSS custom properties
- **Dark mode**: Toggle via `$state()` rune, applies `.dark` class to `<html>`
- **Static images**: SVGs in `static/` directory, referenced as `/images/...`
