# Rsbuild + React + Tailwind CSS v4 + shadcn/ui

A showcase/portfolio landing page built with Rsbuild, React 19, Tailwind CSS v4, and shadcn/ui components.

## What this demonstrates

- **Rsbuild** as the build tool (Rspack-powered, Rust-based)
- **React 19** with TypeScript
- **Tailwind CSS v4** via `@tailwindcss/postcss` (no `tailwind.config.js` needed)
- **shadcn/ui** components (new-york style) with oklch color variables
- **Static assets**: files in `public/` served as-is, files in `src/assets/` processed by the bundler
- **Dark mode** toggle using class strategy

## Getting started

```bash
bun install
bun run dev
```

## Build for production

```bash
bun run build
bun run preview
```

## Key patterns

| Pattern | Details |
|---|---|
| Static assets | SVGs in `public/` are served directly at their path (e.g., `/images/showcase-1.svg`) |
| Imported assets | SVGs in `src/assets/` are imported in code and hashed for cache busting |
| Path alias | `@/*` maps to `./src/*` via both `tsconfig.json` and `rsbuild.config.ts` |
| Tailwind v4 | Uses `@import "tailwindcss"` syntax with CSS variables, no config file |
| PostCSS | Configured in `postcss.config.mjs` with `@tailwindcss/postcss` |
| shadcn/ui | Components in `src/components/ui/`, configured via `components.json` |
