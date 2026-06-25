# Production image for the Temps Observability Starter.
#
# Committed (rather than relying on Temps' preset generation) so:
#   - CI in this repo can build + publish a prebuilt image to GHCR, which the
#     Temps template deploys instantly (no build step), and
#   - Temps' build-from-source fallback uses this exact Dockerfile too.
#
# Multi-stage: build with Bun on full Node, run on hardened Alpine.

# ---- Build stage ----
FROM node:22 AS build
WORKDIR /app

# Bun for fast installs/builds.
RUN apt-get update && apt-get install -y --no-install-recommends curl unzip \
    && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Install dependencies (cached on lockfile).
COPY package.json bun.lock* ./
RUN --mount=type=cache,target=/root/.bun/install/cache bun install

# Build the Next.js app.
COPY . .
RUN --mount=type=cache,target=/app/.next/cache bun run build

# ---- Runtime stage ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Non-root user.
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs
USER nextjs

# Copy the built app (node_modules + .next + public + config).
COPY --from=build --chown=nextjs:nodejs /app /app

EXPOSE 3000

CMD ["node", "/app/node_modules/next/dist/bin/next", "start"]
