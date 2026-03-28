# Java Spring Boot with PostgreSQL & Redis

A contacts/address book API built with Spring Boot 3.5, PostgreSQL, and Redis caching.

## Quick Start

```bash
# Start all services
docker compose up -d

# Check health
curl http://localhost:8080/health
curl http://localhost:8080/actuator/health

# List contacts
curl http://localhost:8080/api/contacts

# Create a contact
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Dave", "lastName": "Chen", "email": "dave@example.com", "company": "TechCo", "role": "Engineer"}'

# Search contacts
curl "http://localhost:8080/api/contacts/search?q=alice"

# Filter by company
curl http://localhost:8080/api/contacts/company/Acme%20Corp
```

## Deploy to Temps

```bash
temps projects create -n "contacts-api"
temps services create -t postgres -n contacts-db
temps services create -t redis -n contacts-cache
temps services link --id 1 --project contacts-api
temps services link --id 2 --project contacts-api
temps deploy contacts-api
```

## Services

| Service  | Port | Description              |
|----------|------|--------------------------|
| api      | 8080 | Spring Boot application  |
| postgres | 5432 | PostgreSQL 17            |
| redis    | 6379 | Redis 8 (cache layer)    |

## API Endpoints

| Method | Endpoint                      | Description         |
|--------|-------------------------------|---------------------|
| GET    | /health                       | Health check        |
| GET    | /actuator/health              | Spring Actuator     |
| GET    | /api/contacts                 | List all contacts   |
| GET    | /api/contacts/search?q=X      | Search by name      |
| GET    | /api/contacts/company/:name   | Filter by company   |
| POST   | /api/contacts                 | Create contact      |
| GET    | /api/contacts/:id             | Get contact         |
| PUT    | /api/contacts/:id             | Update contact      |
| DELETE | /api/contacts/:id             | Delete contact      |
