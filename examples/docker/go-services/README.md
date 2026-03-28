# Go Microservices with PostgreSQL, Redis & Nginx

A multi-service architecture with two Go APIs behind Nginx reverse proxy.

## Architecture

```
                    ┌──────────────┐
                    │    Nginx     │ :8080
                    │ (reverse     │
                    │  proxy)      │
                    └──────┬───────┘
                     ┌─────┴─────┐
                     │           │
              ┌──────▼──┐  ┌────▼─────┐
              │users-api│  │ feed-api  │
              │  :3001  │  │   :3002   │
              └────┬────┘  └─────┬─────┘
                   │             │
              ┌────▼────┐  ┌────▼─────┐
              │Postgres │  │  Redis   │
              │  :5432  │  │  :6379   │
              └─────────┘  └──────────┘
```

## Quick Start

```bash
# Initialize Go dependencies (required before first build)
go mod tidy

# Start all services
docker compose up -d

# Check health
curl http://localhost:8080/health

# Users API
curl http://localhost:8080/api/users
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "dave", "email": "dave@example.com", "bio": "Go developer"}'

# Feed API
curl http://localhost:8080/api/feed
curl http://localhost:8080/api/feed/1
curl -X POST http://localhost:8080/api/feed \
  -H "Content-Type: application/json" \
  -d '{"user_id": "1", "action": "deployed", "target": "service/my-app"}'
```

## Deploy to Temps

```bash
# Create projects
temps projects create -n "users-api"
temps projects create -n "feed-api"

# Create and link services
temps services create -t postgres -n shared-db
temps services create -t redis -n shared-cache
temps services link --id 1 --project users-api
temps services link --id 2 --project feed-api

# Deploy each service
temps deploy users-api
temps deploy feed-api
```

## Services

| Service    | Port | Description                  |
|------------|------|------------------------------|
| nginx      | 8080 | Reverse proxy                |
| users-api  | 3001 | User CRUD (Go + PostgreSQL)  |
| feed-api   | 3002 | Activity feed (Go + Redis)   |
| postgres   | 5432 | PostgreSQL 17                |
| redis      | 6379 | Redis 8                      |

## API Endpoints

### Users API (`/api/users`)

| Method | Endpoint        | Description   |
|--------|-----------------|---------------|
| GET    | /api/users      | List users    |
| POST   | /api/users      | Create user   |
| GET    | /api/users/:id  | Get user      |
| DELETE | /api/users/:id  | Delete user   |

### Feed API (`/api/feed`)

| Method | Endpoint                 | Description           |
|--------|--------------------------|----------------------|
| GET    | /api/feed                | Global feed          |
| POST   | /api/feed                | Add feed item        |
| GET    | /api/feed/:user_id       | User's feed          |

## Notes

- Run `go mod tidy` before the first build to populate `go.sum` with dependency checksums.
- The Dockerfile uses a multi-stage build with a build arg (`SERVICE`) to compile the correct service binary.
- PostgreSQL is seeded with sample users via `init.sql`.
- Redis feed is seeded on first startup by the feed-api service.
