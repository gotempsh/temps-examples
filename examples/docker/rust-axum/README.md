# Rust Axum API with PostgreSQL

A high-performance notes/snippets API built with Axum and PostgreSQL.

## Quick Start

```bash
# Start all services
docker compose up -d

# Check health
curl http://localhost:3000/health

# List notes
curl http://localhost:3000/api/notes

# Create a note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Quick Sort", "content": "fn sort(arr: &mut [i32]) { ... }", "language": "rust", "tags": ["rust", "algorithm"]}'

# Filter by tag
curl "http://localhost:3000/api/notes?tag=rust"

# Filter by language
curl "http://localhost:3000/api/notes?language=javascript"

# List tags
curl http://localhost:3000/api/tags
```

## Deploy to Temps

```bash
temps projects create -n "notes-api"
temps services create -t postgres -n notes-db
temps services link --id 1 --project notes-api
temps deploy notes-api
```

## Services

| Service  | Port | Description          |
|----------|------|----------------------|
| api      | 3000 | Axum REST API        |
| postgres | 5432 | PostgreSQL 17        |

## API Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | /health             | Health check             |
| GET    | /api/notes          | List notes (filter: ?tag=X&language=Y) |
| POST   | /api/notes          | Create note              |
| GET    | /api/notes/:id      | Get note by UUID         |
| PATCH  | /api/notes/:id      | Update note              |
| DELETE | /api/notes/:id      | Delete note              |
| GET    | /api/tags           | List tags with counts    |
