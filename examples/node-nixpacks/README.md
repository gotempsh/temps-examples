# Node.js with Nixpacks

A zero-dependency Node.js HTTP service for testing a Nixpacks deployment from a
repository subdirectory.

## Run locally

```bash
cp .env.example .env
set -a
source .env
set +a
npm start
```

The service listens on `http://localhost:3000`.

## Deploy on Temps

1. Create a project from `gotempsh/temps-examples`.
2. Set the root directory to `/examples/node-nixpacks`.
3. Select **Nixpacks (Node.js)**.
4. Deploy.

Temps supplies `PORT` at runtime, so no additional configuration is required.

## Endpoints

- `GET /` — deployment metadata and a greeting
- `GET /health` — health check
