# Java Spring Boot (Contacts API)

A contacts/address book API built with Spring Boot 3.5, PostgreSQL, and Redis caching.

## Build & Run

```bash
# Build the image
docker build -t contacts-api .

# Run the container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/contacts \
  -e SPRING_DATASOURCE_USERNAME=app \
  -e SPRING_DATASOURCE_PASSWORD=secret \
  -e SPRING_DATA_REDIS_HOST=redis-host \
  contacts-api
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
