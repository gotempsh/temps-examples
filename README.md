# Temps Examples

Production-ready example applications showcasing [Temps](https://temps.sh) SDK integrations. Each example is a self-contained project you can clone and deploy.

## Examples

### Fullstack

| Example | Stack | Description |
|---------|-------|-------------|
| [observability-starter](./examples/observability-starter) | Next.js 16, React 19, PostgreSQL | One-deploy demo wiring Temps analytics, error tracking, tracing, and a database — the fastest way to see Temps in action |
| [nextjs-saas](./examples/nextjs-saas) | Next.js 16, React 19, Stripe, PostgreSQL | SaaS boilerplate with auth, billing, and dashboard |
| [docs-template](./examples/docs-template) | Next.js 16, React 19, MDX | Documentation site with API reference and blog |
| [sveltekit](./examples/sveltekit) | SvelteKit 2, Svelte 5, Tailwind v4 | SaaS landing page with SSR |

### Frontend

| Example | Stack | Description |
|---------|-------|-------------|
| [vite-react](./examples/vite-react) | Vite 6, React 19, Tailwind v4, shadcn/ui | Landing page with static assets |
| [rsbuild-react](./examples/rsbuild-react) | Rsbuild, React 19, Tailwind v4, shadcn/ui | Product showcase with static assets |
| [astro](./examples/astro) | Astro 5, Tailwind v4 | Developer portfolio (static site) |

### Docker

| Example | Stack | Description |
|---------|-------|-------------|
| [docker/node-api](./examples/docker/node-api) | Bun, PostgreSQL | Todo REST API |
| [docker/python-fastapi](./examples/docker/python-fastapi) | FastAPI, MongoDB, Redis | Bookmarks API with caching |
| [docker/go-services](./examples/docker/go-services) | Go, PostgreSQL | Users API with pgx |
| [docker/rust-axum](./examples/docker/rust-axum) | Rust Axum, PostgreSQL | Notes/snippets API |
| [docker/java-spring](./examples/docker/java-spring) | Spring Boot 3.5, PostgreSQL, Redis | Contacts API with JPA |

### Language starters

Minimal one-file-per-language apps — the smallest thing that builds and serves
a request. See [examples/starters](./examples/starters) for the full list and
for which ones nixpacks can currently build.

| Starter | Stack |
|---------|-------|
| [starters/nodejs](./examples/starters/nodejs) | Express, Fastify, Hono, NestJS |
| [starters/python](./examples/starters/python) | Flask, FastAPI, Django |
| [starters/go](./examples/starters/go) | net/http, Gin |
| [starters/ruby](./examples/starters/ruby) | Rails 8 |
| [starters/php](./examples/starters/php) | Plain PHP, Laravel 12 |
| [starters/java](./examples/starters/java), [dotnet](./examples/starters/dotnet), [elixir](./examples/starters/elixir), [swift](./examples/starters/swift), [rust](./examples/starters/rust), [deno](./examples/starters/deno), [bun](./examples/starters/bun) | one minimal app each |

### Deployment compatibility

| Example | Stack | Description |
|---------|-------|-------------|
| [drop-runtime-fixtures](./examples/drop-runtime-fixtures) | .NET, Java, Python, Rust, Go | Minimal manifest-only services for `/drop` zero-config deployment tests |

## Getting Started

Each example lives in its own directory under `examples/` with its own README and setup instructions.

```bash
# Clone the repo
git clone https://github.com/gotempsh/temps-examples.git

# Frontend / Fullstack examples
cd temps-examples/examples/vite-react
bun install && bun run dev

# Docker examples
cd temps-examples/examples/docker/node-api
docker build -t my-app .
docker run -p 3000:3000 -e POSTGRES_URL=... my-app
```

## Contributing

1. Fork the repository
2. Create a new example under `examples/`
3. Include a `README.md` with setup instructions and a `.env.example`
4. Open a pull request

## License

MIT
