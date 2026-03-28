# Python FastAPI with MongoDB & Redis

A bookmarks API built with FastAPI, MongoDB, and Redis caching.

## Quick Start

```bash
# Start all services
docker compose up -d

# Check health
curl http://localhost:8000/health

# List bookmarks
curl http://localhost:8000/api/bookmarks

# Create a bookmark
curl -X POST http://localhost:8000/api/bookmarks \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "title": "Example", "tags": ["test"]}'

# Filter by tag
curl http://localhost:8000/api/bookmarks?tag=docs

# List tags
curl http://localhost:8000/api/tags
```

## Deploy to Temps

```bash
# Create project and services
temps projects create -n "bookmarks-api"
temps services create -t mongodb -n bookmarks-db
temps services create -t redis -n bookmarks-cache

# Link services
temps services link --id 1 --project bookmarks-api
temps services link --id 2 --project bookmarks-api

# Deploy
temps deploy bookmarks-api
```

## Services

| Service | Port  | Description              |
|---------|-------|--------------------------|
| api     | 8000  | FastAPI application      |
| mongo   | 27017 | MongoDB 7                |
| redis   | 6379  | Redis 8 (cache layer)    |

## API Endpoints

| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| GET    | /health                  | Health check          |
| GET    | /api/bookmarks           | List bookmarks        |
| GET    | /api/bookmarks?tag=X     | Filter by tag         |
| POST   | /api/bookmarks           | Create bookmark       |
| GET    | /api/bookmarks/:id       | Get bookmark          |
| PATCH  | /api/bookmarks/:id       | Update bookmark       |
| DELETE | /api/bookmarks/:id       | Delete bookmark       |
| GET    | /api/tags                | List all tags + count |

## Interactive Docs

FastAPI auto-generates interactive API docs at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
