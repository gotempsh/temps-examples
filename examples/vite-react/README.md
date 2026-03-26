# Vite + React + Tailwind CSS v4 + shadcn/ui

A showcase/portfolio landing page demonstrating Vite with React, Tailwind CSS v4, and shadcn/ui components. Includes examples of static asset handling from both `public/` and `src/assets/`.

## Getting Started

```bash
bun install
bun run dev
```

## Production Build

```bash
bun run build
bun run preview
```

## Key Patterns

- **Tailwind CSS v4** -- uses `@import "tailwindcss"` and `@tailwindcss/vite` plugin (no `tailwind.config.js`)
- **shadcn/ui** -- `new-york` style with oklch CSS variables for light/dark themes
- **Static assets in `public/`** -- referenced via absolute paths like `/images/hero-illustration.svg`
- **Imported assets from `src/assets/`** -- imported as modules, e.g. `import reactLogo from "@/assets/react.svg"`
- **Path alias** -- `@/*` maps to `./src/*`
- **Theme toggle** -- simple dark/light mode via toggling the `dark` class on `<html>`
