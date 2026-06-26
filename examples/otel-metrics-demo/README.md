# OTLP Metrics Demo

A tiny standalone script that exports OpenTelemetry **metrics** to a Temps
server over OTLP/HTTP — the fastest way to confirm the metrics ingest path works
end to end.

## What

Uses the standard OpenTelemetry SDK (`@opentelemetry/sdk-metrics` +
`@opentelemetry/exporter-metrics-otlp-proto`) to push protobuf metrics straight
to Temps' `/api/otel/v1/metrics` endpoint — no collector sidecar required. It
emits three instruments, each with labels:

| Instrument | Type | Name |
|---|---|---|
| Counter | sum | `demo.requests.total` |
| Histogram | histogram | `demo.request.duration` |
| Observable gauge | gauge | `demo.active.requests` |

For a full app that wires analytics, error tracking, tracing **and** metrics,
see [`observability-starter`](../observability-starter).

## Run

```bash
bun install
TEMPS_TOKEN=tk_your_key TEMPS_PROJECT_ID=123 node index.mjs
```

Then open your project's **Monitoring → Metrics** in Temps; the three
`demo.*` metrics should appear within a few seconds.

## Configuration

| Env var | Default | Purpose |
|---|---|---|
| `TEMPS_TOKEN` | — (required) | A Temps API key (`tk_…`) with access to the project |
| `TEMPS_PROJECT_ID` | — (required) | Project to attribute metrics to (sent as the `X-Temps-Project-Id` header) |
| `TEMPS_OTLP_URL` | `http://localhost:8080/api/otel/v1/metrics` | The Temps OTLP/HTTP metrics endpoint |

Create an API key in Temps under **Settings → API Keys** (or via the CLI:
`temps api-key --name metrics-demo --role admin`).
