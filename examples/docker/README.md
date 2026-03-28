# Docker Examples for Temps Platform

Production-ready Dockerfile examples for deploying applications on Temps.

## Examples

| Example | Stack | Description |
|---------|-------|-------------|
| [node-api](./node-api/) | Bun + PostgreSQL | Todo REST API |
| [python-fastapi](./python-fastapi/) | FastAPI + MongoDB + Redis | Bookmarks API with caching |
| [go-services](./go-services/) | Go + PostgreSQL | Users API with pgx |
| [rust-axum](./rust-axum/) | Rust Axum + PostgreSQL | Notes/snippets API |
| [java-spring](./java-spring/) | Spring Boot 3.5 + PostgreSQL + Redis | Contacts API with JPA |

## Build & Run

Each example includes a Dockerfile:

```bash
cd <example-dir>
docker build -t my-app .
docker run -p 3000:3000 -e POSTGRES_URL=... my-app
```

## Deploy to Temps

```bash
# Install Temps CLI
bunx @temps-sdk/cli login

# Create project and provision services
temps projects create -n "my-app"
temps services create -t postgres -n my-db
temps services link --id 1 --project my-app

# Deploy
temps deploy my-app
```

Temps auto-detects the Dockerfile and builds the image. Services (Postgres, Redis, MongoDB) are provisioned separately via `temps services create` and linked to your project — connection strings are injected as environment variables.

See each example's README for specific deployment instructions.
