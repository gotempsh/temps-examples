# Python FastAPI (Bookmarks API)

A bookmarks API built with FastAPI, MongoDB, and Redis caching.

## Build & Run

```bash
# Build the image
docker build -t bookmarks-api .

# Run the container
docker run -p 8000:8000 \
  -e MONGODB_URL=mongodb://user:pass@host:27017/bookmarks?authSource=admin \
  -e REDIS_URL=redis://host:6379 \
  bookmarks-api
```

## Deploy to Temps

```bash
temps projects create -n "bookmarks-api"
temps services create -t mongodb -n bookmarks-db
temps services create -t redis -n bookmarks-cache
temps services link --id 1 --project bookmarks-api
temps services link --id 2 --project bookmarks-api
temps deploy bookmarks-api
```

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

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
