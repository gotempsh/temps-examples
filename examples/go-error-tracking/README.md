# Go Error Tracking (source context)

Minimal Go app showing Temps error tracking with **source context** — the actual
source code shown around each stack frame.

`GET /boom` reports an error to Temps. Deploy this, enable
**Settings → General → Error Tracking Source Context**, and Temps captures the
source from the build automatically (keyed by the deployed commit SHA). Open the
error and expand a frame to see the Go source.

Release setup follows [ADR-033](https://github.com/gotempsh/temps): `Release` is
left unset so `sentry-go` reads `SENTRY_RELEASE` (the deployed commit SHA that
Temps injects) — never hard-coded.

## Endpoints
- `GET /` — hello
- `GET /health` — health check
- `GET /boom` — reports an error to Temps
