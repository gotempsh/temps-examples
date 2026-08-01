# Language starters

Minimal, single-purpose applications — one per language or runtime. Each is the
smallest thing that builds and answers an HTTP request, so it is a starting
point rather than a showcase. For richer, production-shaped examples see the
top level of [`examples/`](../).

Every starter listens on `$PORT` and binds `0.0.0.0`, which is what makes it
reachable once deployed.

| Starter | Stack |
|---|---|
| [nodejs/express](./nodejs/express) | Express (npm) |
| [nodejs/fastify](./nodejs/fastify) | Fastify (pnpm) |
| [nodejs/hono](./nodejs/hono) | Hono (Bun) |
| [nodejs/nestjs](./nodejs/nestjs) | NestJS |
| [nextjs/app-router](./nextjs/app-router) | Next.js App Router |
| [bun/bun-server](./bun/bun-server) | Bun native HTTP server |
| [bun/elysia](./bun/elysia) | Elysia |
| [deno](./deno) | Deno |
| [vite/react](./vite/react) | Vite + React (static) |
| [astro](./astro) | Astro (node adapter) |
| [nuxt](./nuxt) | Nuxt 3 |
| [sveltekit](./sveltekit) | SvelteKit (node adapter) |
| [python/flask](./python/flask) | Flask + Gunicorn |
| [python/fastapi](./python/fastapi) | FastAPI |
| [python/django](./python/django) | Django + WhiteNoise |
| [go/net-http](./go/net-http) | Go `net/http` |
| [go/gin](./go/gin) | Gin |
| [rust/actix](./rust/actix) | Actix Web |
| [ruby/rails](./ruby/rails) | Rails 8 (API-only) |
| [php/vanilla](./php/vanilla) | Plain PHP |
| [php/laravel](./php/laravel) | Laravel 12 |
| [java/spring-boot](./java/spring-boot) | Spring Boot 3 |
| [dotnet/web](./dotnet/web) | ASP.NET Core minimal API |
| [elixir/phoenix](./elixir/phoenix) | Phoenix 1.7 (API-only) |
| [swift/vapor](./swift/vapor) | Vapor 4 |
| [dockerfile](./dockerfile) | Custom multi-stage Dockerfile |

## Verification

`.github/workflows/starters.yml` builds every starter with nixpacks and waits
for a real HTTP response — on push, on pull requests, and weekly, because base
images and package registries move even when this directory does not.

The workflow has two groups. The first is blocking. The second,
`nixpacks-gaps`, is **not**: those starters are correct and build fine with a
current toolchain, but nixpacks resolves runtimes from the Nix package set,
which lags upstream. As of 2026-08-01:

| Starter | Why nixpacks cannot build it |
|---|---|
| `go/net-http`, `go/gin` | `go.mod` declares `go 1.24`; Nix ships an older Go and the toolchain auto-download fails |
| `dotnet/web` | Nix provides dotnet-sdk 6.0.413 against a `net9.0` project |
| `astro`, `nuxt` | Nix npm is older than the `npm >=9.6.5` these require |
| `swift/vapor` | `swift: command not found` |
| `deno` | no build plan for a bare `main.ts` |
| `java/spring-boot` | no build plan for `build.gradle` without a wrapper |
| `bun/*`, `nodejs/hono` | `bun: not found` |
| `python/django` | container exits at startup under the generated start command |

They are kept visible rather than deleted, so the day nixpacks catches up the
CI tells us.
