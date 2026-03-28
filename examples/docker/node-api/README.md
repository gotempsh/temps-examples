# Node.js API (Bun)

A REST API built with Bun and PostgreSQL.

## Build & Run

```bash
# Build the image
docker build -t node-api .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  node-api
```

## Deploy to Temps

```bash
temps projects create -n "node-api"
temps services create -t postgres -n api-db
temps services link --id 1 --project node-api
temps deploy node-api
```

## API Endpoints

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| GET    | /health            | Health check         |
| GET    | /api/todos         | List all todos       |
| POST   | /api/todos         | Create a todo        |
| PATCH  | /api/todos/:id     | Toggle todo status   |
| DELETE | /api/todos/:id     | Delete a todo        |
| GET    | /api/users         | List all users       |
