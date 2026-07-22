import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SimulateCTA } from "@/components/SimulateCTA";

const HERO_STATS = [
  { label: "MRR", value: "$48,200" },
  { label: "Subscribers", value: "1,284" },
  { label: "Churn", value: "2.1%" },
  { label: "New / week", value: "63" },
];

const FUNNEL = [
  { label: "Visited", value: "4,910", pct: 100 },
  { label: "Viewed pricing", value: "1,820", pct: 63 },
  { label: "Signed up", value: "412", pct: 34 },
  { label: "Subscribed", value: "128", pct: 21 },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* Hero — Stat-Led: copy left, live product panel right */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-faint">
              Revenue analytics
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Know your revenue the moment it moves.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
              Cadence turns every signup, plan change, and cancellation into
              live MRR — so you see growth as it happens, not at month-end.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SimulateCTA />
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                See pricing →
              </Link>
            </div>
            <p className="mt-6 font-mono text-xs leading-relaxed text-ink-faint">
              ▶ Runs a real visitor journey — watch it stream into Temps
              analytics, traces, and logs.
            </p>
          </div>

          <div className="lg:col-span-7">
            <ProductPanel />
          </div>
        </div>
      </section>

      {/* Stat band */}
      <section>
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {HERO_STATS.map((s) => (
            <div key={s.label} className="bg-paper px-6 py-8">
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                {s.label}
              </dt>
              <dd className="mt-2 font-mono text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mx-auto max-w-6xl px-6 py-3 text-right font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          Sample data
        </p>
      </section>

      {/* Features — asymmetric grid */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-faint">
          What you get
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Every revenue signal, in one place.
        </h2>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {/* Live MRR — wide, with a chart */}
          <article className="rounded-2xl border border-line bg-paper-2 p-6 lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
              Live MRR
            </p>
            <h3 className="mt-2 text-xl font-semibold text-ink">
              Recognised revenue, updated the instant a plan changes.
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
              No month-end batch job. Upgrades, downgrades, and cancellations
              land in the number as they happen.
            </p>
            <AreaChart className="mt-6" />
          </article>

          {/* Churn radar — narrow */}
          <article className="rounded-2xl border border-line bg-paper-2 p-6 lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-rose">
              Churn radar
            </p>
            <h3 className="mt-2 text-xl font-semibold text-ink">
              Catch cancellations before they compound.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Cohort retention and downgrade alerts, so a bad week never
              surprises you at renewal.
            </p>
            <div className="mt-6 flex items-end gap-1.5">
              {[40, 55, 48, 62, 70, 66, 78, 84].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-full rounded-sm bg-rose/40"
                />
              ))}
            </div>
          </article>

          {/* Funnel — full width, mirrors the Simulate journey */}
          <article className="rounded-2xl border border-line bg-paper-2 p-6 lg:col-span-12">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                  Funnel tracking
                </p>
                <h3 className="mt-2 text-xl font-semibold text-ink">
                  See exactly where signups turn into subscriptions.
                </h3>
              </div>
              <p className="font-mono text-xs text-ink-faint">
                This is the journey Simulate fires ↴
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {FUNNEL.map((step, i) => (
                <div
                  key={step.label}
                  className="rounded-xl border border-line bg-paper p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-5 w-5 place-items-center rounded-full border border-line font-mono text-[10px] text-ink-faint">
                      {i + 1}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                      {step.label}
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-2xl font-semibold text-ink">
                    {step.value}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-3">
                    <span
                      style={{ width: `${step.pct}%` }}
                      className="block h-full rounded-full bg-accent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Deploy it. Hit Simulate. Watch the data land.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
            One click runs a full visitor-to-paid journey and streams pageviews,
            funnel events, a session replay, a trace, logs, and a caught error
            straight into your Temps project.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <SimulateCTA />
            <Link
              href="/signup?plan=pro"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              Start free →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function ProductPanel() {
  return (
    <figure className="relative rounded-2xl border border-line bg-paper-2 p-5 shadow-2xl shadow-black/40 sm:p-6">
      <span className="absolute right-4 top-4 rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
        Sample data
      </span>

      <div className="flex items-center gap-2 text-ink-muted">
        <span className="cds-pulse h-2 w-2 rounded-full bg-accent" />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
          Live · MRR
        </span>
      </div>

      <div className="mt-2 flex items-end gap-3">
        <span className="font-mono text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          $48,200
        </span>
        <span className="mb-1.5 rounded-md bg-accent/15 px-1.5 py-0.5 font-mono text-xs text-accent">
          +12.4%
        </span>
      </div>

      <AreaChart className="mt-5" />

      <div className="mt-5 grid grid-cols-3 gap-3">
        <PanelStat label="Subscribers" value="1,284" />
        <PanelStat label="Churn" value="2.1%" tone="rose" />
        <PanelStat label="New / wk" value="63" tone="accent" />
      </div>
    </figure>
  );
}

function PanelStat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "accent" | "rose";
}) {
  const color =
    tone === "accent"
      ? "text-accent"
      : tone === "rose"
        ? "text-rose"
        : "text-ink";
  return (
    <div className="rounded-lg border border-line bg-paper px-3 py-2.5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <p className={`mt-1 font-mono text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function AreaChart({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 90"
      preserveAspectRatio="none"
      className={`w-full ${className}`}
      role="img"
      aria-label="Revenue trend, up and to the right"
    >
      <defs>
        <linearGradient id="cds-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,72 L40,66 L80,68 L120,54 L160,56 L200,42 L240,34 L280,22 L320,14 L320,90 L0,90 Z"
        fill="url(#cds-area)"
      />
      <path
        d="M0,72 L40,66 L80,68 L120,54 L160,56 L200,42 L240,34 L280,22 L320,14"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
