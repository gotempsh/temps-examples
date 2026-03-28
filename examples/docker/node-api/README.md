# Node.js API with PostgreSQL & Redis

A production-ready REST API built with Bun, PostgreSQL, and Redis.

## Quick Start

```bash
# Start all services
docker compose up -d

# Check health
curl http://localhost:3000/health

# List todos
curl http://localhost:3000/api/todos

# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "My new todo"}'
```

## Deploy to Temps

```bash
# Create project
temps projects create -n "node-api"

# Create and link services
temps services create -t postgres -n api-db
temps services create -t redis -n api-cache
temps services link --id 1 --project node-api
temps services link --id 2 --project node-api

# Deploy
temps deploy node-api
```

## Services

| Service    | Port | Description          |
|------------|------|----------------------|
| app        | 3000 | REST API (Bun)       |
| postgres   | 5432 | PostgreSQL 17        |
| redis      | 6379 | Redis 8 (cache)      |

## API Endpoints

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | /health            | Health check         |
| GET    | /api/todos         | List all todos       |
| POST   | /api/todos         | Create a todo        |
| PATCH  | /api/todos/:id     | Toggle todo status   |
| DELETE | /api/todos/:id     | Delete a todo        |
| GET    | /api/users         | List all users       |
