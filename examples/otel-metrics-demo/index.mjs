// Minimal real-OpenTelemetry-SDK app that exports OTLP/HTTP protobuf metrics to
// a Temps server. Emits a Counter, a Histogram and an ObservableGauge — each
// with labels — then force-flushes and exits. Use it to verify the Temps
// ClickHouse metrics ingest path end-to-end.
//
//   TEMPS_TOKEN=tk_... TEMPS_PROJECT_ID=5 node index.mjs
//
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { Resource } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

const TOKEN = process.env.TEMPS_TOKEN;
const PROJECT_ID = process.env.TEMPS_PROJECT_ID;
const URL =
  process.env.TEMPS_OTLP_URL || 'http://localhost:8080/api/otel/v1/metrics';

if (!TOKEN || !PROJECT_ID) {
  console.error('Set TEMPS_TOKEN and TEMPS_PROJECT_ID');
  process.exit(1);
}

const exporter = new OTLPMetricExporter({
  url: URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'X-Temps-Project-Id': String(PROJECT_ID),
  },
});

const provider = new MeterProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'otel-metrics-demo',
    [ATTR_SERVICE_VERSION]: '1.0.0',
  }),
  readers: [
    new PeriodicExportingMetricReader({
      exporter,
      exportIntervalMillis: 2000,
    }),
  ],
});

const meter = provider.getMeter('otel-metrics-demo');

// Counter (monotonic, cumulative by default).
const requests = meter.createCounter('demo.requests.total', {
  description: 'Total demo requests',
  unit: '1',
});
// Histogram (explicit buckets).
const latency = meter.createHistogram('demo.request.duration', {
  description: 'Demo request latency',
  unit: 'ms',
});
// Observable gauge.
let inFlight = 0;
meter
  .createObservableGauge('demo.active.requests', {
    description: 'In-flight demo requests',
    unit: '1',
  })
  .addCallback((res) => res.observe(inFlight, { region: 'eu' }));

// Generate some traffic.
for (let i = 0; i < 100; i++) {
  const method = i % 2 === 0 ? 'GET' : 'POST';
  requests.add(1, { 'http.method': method, route: '/checkout' });
  latency.record(Math.round(Math.random() * 480) + 5, { 'http.method': method });
  inFlight = Math.floor(Math.random() * 12);
}

console.log(`exporting metrics to ${URL} (project ${PROJECT_ID})...`);
await provider.forceFlush();
// Give the periodic reader one cycle too, then shut down cleanly.
await new Promise((r) => setTimeout(r, 2500));
await provider.shutdown();
console.log('done — metrics flushed.');
