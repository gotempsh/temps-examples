# Go API (Users)

A users API built with Go and PostgreSQL using pgx.

## Build & Run

```bash
# Build the image
docker build -t users-api .

# Run the container
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e PORT=3001 \
  users-api
```

## Deploy to Temps

```bash
temps projects create -n "users-api"
temps services create -t postgres -n users-db
temps services link --id 1 --project users-api
temps deploy users-api
```

## API Endpoints

| Method | Endpoint        | Description   |
|--------|-----------------|---------------|
| GET    | /health         | Health check  |
| GET    | /api/users      | List users    |
| POST   | /api/users      | Create user   |
| GET    | /api/users/:id  | Get user      |
| DELETE | /api/users/:id  | Delete user   |

## Notes

- Run `go mod tidy` before the first build to populate `go.sum`.
- The Dockerfile handles this automatically during the build.
