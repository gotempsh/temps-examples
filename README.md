# Temps Examples

Production-ready example applications showcasing [Temps](https://temps.sh) SDK integrations. Each example is a self-contained project you can clone and deploy.

## Examples

### Fullstack

| Example | Stack | Description |
|---------|-------|-------------|
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
