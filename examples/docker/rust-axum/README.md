# Rust Axum API (Notes)

A high-performance notes/snippets API built with Axum and PostgreSQL.

## Build & Run

```bash
# Build the image
docker build -t notes-api .

# Run the container
docker run -p 3000:3000 \
  -e POSTGRES_URL=postgresql://user:pass@host:5432/notes \
  -e RUST_LOG=info \
  notes-api
```

## Deploy to Temps

```bash
temps projects create -n "notes-api"
temps services create -t postgres -n notes-db
temps services link --id 1 --project notes-api
temps deploy notes-api
```

## API Endpoints

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | /health             | Health check             |
| GET    | /api/notes          | List notes (?tag=X&language=Y) |
| POST   | /api/notes          | Create note              |
| GET    | /api/notes/:id      | Get note by UUID         |
| PATCH  | /api/notes/:id      | Update note              |
| DELETE | /api/notes/:id      | Delete note              |
| GET    | /api/tags           | List tags with counts    |
