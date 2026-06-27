"use client";

import { useCallback, useEffect, useState } from "react";
import { useTempsAnalytics } from "@temps-sdk/react-analytics";
import type { GuestbookEntry } from "@/lib/db";

export default function Home() {
  const { trackEvent } = useTempsAnalytics();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [hasDatabase, setHasDatabase] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [anomalyMsg, setAnomalyMsg] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    const res = await fetch("/api/guestbook");
    const data = await res.json();
    setEntries(data.entries ?? []);
    setHasDatabase(Boolean(data.hasDatabase));
  }, []);

  // Load the guestbook once on mount. `ignore` guards against a late response
  // applying state after unmount; the setState calls live inside the async
  // callback (synchronizing React with the server), which is the intended use
  // of an effect.
  useEffect(() => {
    let ignore = false;
    fetch("/api/guestbook")
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        setEntries(data.entries ?? []);
        setHasDatabase(Boolean(data.hasDatabase));
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    if (res.ok) {
      // Track a custom product-analytics event — shows up in Temps Analytics.
      trackEvent("guestbook_signed", { name_length: name.length });
      setName("");
      setMessage("");
      setStatus("Signed! Your entry is below.");
      await loadEntries();
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus(data.error ?? "Something went wrong");
    }
  }

  function triggerError() {
    // Fire-and-forget request to the route that throws, so error tracking has
    // something to capture.
    fetch("/api/error-test").catch(() => {});
    // Also throw on the client so browser-side Sentry + session replay capture it.
    trackEvent("error_test_clicked");
    setTimeout(() => {
      throw new Error("Test client error from the Observability Starter demo");
    }, 0);
  }

  async function triggerAnomaly() {
    trackEvent("anomaly_triggered");
    setAnomalyMsg("Triggering…");
    try {
      const res = await fetch("/api/anomaly", { method: "POST" });
      const data = await res.json();
      setAnomalyMsg(
        data.until
          ? `guestbook.activity.level is now spiking until ${new Date(
              data.until,
            ).toLocaleTimeString()} — a Temps anomaly alert on it will fire shortly.`
          : "Triggered.",
      );
    } catch {
      setAnomalyMsg("Could not reach /api/anomaly.");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        Temps Observability Starter
      </h1>
      <p className="mt-3 text-neutral-400">
        One deploy gives you product analytics, error tracking, distributed
        traces, and a Postgres database — all visible in your Temps dashboard.
      </p>

      <ul className="mt-6 space-y-1 text-sm text-neutral-400">
        <li>📊 Analytics — pageviews + the custom event below</li>
        <li>🐞 Error tracking — the “Trigger an error” button</li>
        <li>📈 Metrics &amp; anomalies — the “Trigger an anomaly” button</li>
        <li>🔭 Tracing — every guestbook request is an OpenTelemetry span</li>
        <li>🗄️ Database — the guestbook is backed by Postgres</li>
      </ul>

      <section className="mt-10 rounded-xl border border-neutral-800 p-6">
        <h2 className="text-xl font-semibold">Guestbook</h2>
        {!hasDatabase && (
          <p className="mt-2 rounded-md bg-amber-950/50 px-3 py-2 text-sm text-amber-300">
            No database attached yet. Attach a Postgres service in Temps and
            redeploy — <code>DATABASE_URL</code> is injected automatically.
          </p>
        )}
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message"
            required
            rows={3}
            className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          />
          <button
            type="submit"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Sign guestbook
          </button>
        </form>
        {status && <p className="mt-3 text-sm text-neutral-400">{status}</p>}

        <ul className="mt-6 space-y-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-md border border-neutral-800 px-3 py-2 text-sm"
            >
              <span className="font-medium">{entry.name}</span>
              <span className="text-neutral-500">
                {" "}
                · {new Date(entry.created_at).toLocaleString()}
              </span>
              <p className="mt-1 text-neutral-300">{entry.message}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-neutral-800 p-6">
        <h2 className="text-xl font-semibold">Test error tracking</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Click below to throw an error on both the server and the client. With a
          Sentry DSN configured, it appears in Temps → Error Tracking, with a
          session replay of this click.
        </p>
        <button
          onClick={triggerError}
          className="mt-4 rounded-md border border-red-900 bg-red-950/50 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-950"
        >
          Trigger an error
        </button>
      </section>

      <section className="mt-8 rounded-xl border border-neutral-800 p-6">
        <h2 className="text-xl font-semibold">Trigger an anomaly</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Spikes the{" "}
          <code className="text-neutral-300">guestbook.activity.level</code> gauge
          for 5 minutes. Add an anomaly alert on that metric in Temps →
          OpenTelemetry → Metrics → Alerts, then click — the alert fires and emails
          a chart of the spike. Let the app run a few minutes first so the detector
          can learn a baseline.
        </p>
        <button
          onClick={triggerAnomaly}
          className="mt-4 rounded-md border border-amber-900 bg-amber-950/50 px-4 py-2 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-950"
        >
          Trigger an anomaly
        </button>
        {anomalyMsg && (
          <p className="mt-3 text-sm text-neutral-400">{anomalyMsg}</p>
        )}
      </section>
    </main>
  );
}
