# Docker Examples for Temps Platform

Production-ready docker-compose examples demonstrating different stacks you can deploy on Temps.

## Examples

| Example | Stack | Services |
|---------|-------|----------|
| [node-api](./node-api/) | Bun + PostgreSQL + Redis | REST API with todo CRUD and caching |
| [python-fastapi](./python-fastapi/) | FastAPI + MongoDB + Redis | Bookmarks API with tag filtering and caching |
| [go-services](./go-services/) | Go + PostgreSQL + Redis + Nginx | Microservices with reverse proxy |
| [rust-axum](./rust-axum/) | Rust Axum + PostgreSQL | Notes/snippets API with UUID keys and tag filtering |
| [java-spring](./java-spring/) | Spring Boot 3.5 + PostgreSQL + Redis | Contacts API with JPA and Redis caching |

## Quick Start

Each example can be started with:

```bash
cd <example-dir>
docker compose up -d
```

## Deploy to Temps

```bash
# Install Temps CLI
npm install -g @temps-sdk/cli

# Login
temps login

# Create project and provision services
temps projects create -n "my-app"
temps services create -t postgres -n my-db
temps services link --id 1 --project my-app

# Deploy
temps deploy my-app
```

See each example's README for specific deployment instructions.
