import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

const STATS = [
  { label: "MRR", value: "$48,200", delta: "+12.4%", tone: "accent" as const },
  { label: "Active subscribers", value: "1,284", delta: "+48", tone: "accent" as const },
  { label: "Churn (30d)", value: "2.1%", delta: "-0.3pp", tone: "accent" as const },
  { label: "New this week", value: "63", delta: "+9", tone: "accent" as const },
];

const SIGNUPS = [
  { name: "Ada Lovelace", company: "Analytical Engines", plan: "Pro", amount: "$29", when: "just now" },
  { name: "Grace Hopper", company: "Cobol Systems", plan: "Scale", amount: "$99", when: "12m ago" },
  { name: "Alan Turing", company: "Bombe Ltd", plan: "Pro", amount: "$29", when: "41m ago" },
  { name: "Katherine Johnson", company: "Orbital", plan: "Scale", amount: "$99", when: "2h ago" },
  { name: "Edsger Dijkstra", company: "ShortestPath", plan: "Free", amount: "$0", when: "3h ago" },
];

const PLAN_MIX = [
  { plan: "Pro", pct: 58, tone: "bg-accent" },
  { plan: "Scale", pct: 27, tone: "bg-focus" },
  { plan: "Free", pct: 15, tone: "bg-line-strong" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Header row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">
              Overview
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Welcome back — here is how revenue is moving.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2 px-3 py-1 font-mono text-[11px] text-ink-muted">
              <span className="cds-pulse h-1.5 w-1.5 rounded-full bg-accent" />
              Live · last 30 days
            </span>
            <span className="rounded-full border border-line bg-paper-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
              Sample data
            </span>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-line bg-paper-2 p-5"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                {s.label}
              </p>
              <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {s.value}
              </p>
              <p className="mt-1 font-mono text-xs text-accent">{s.delta}</p>
            </div>
          ))}
        </div>

        {/* Revenue chart */}
        <div className="mt-6 rounded-2xl border border-line bg-paper-2 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                Recognised revenue
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-ink">
                $48,200 <span className="text-sm text-accent">MRR</span>
              </p>
            </div>
            <div className="hidden gap-1.5 font-mono text-[11px] text-ink-faint sm:flex">
              {["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((m) => (
                <span key={m} className="w-10 text-center">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <RevenueChart />
        </div>

        {/* Recent signups + plan mix */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <section className="rounded-2xl border border-line bg-paper-2 p-6 lg:col-span-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
              Recent signups
            </h2>
            <ul className="mt-4 divide-y divide-line">
              {SIGNUPS.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-paper font-mono text-xs text-ink-muted">
                    {s.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{s.name}</p>
                    <p className="truncate font-mono text-[11px] text-ink-faint">
                      {s.company}
                    </p>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 font-mono text-[11px] ${
                      s.plan === "Free"
                        ? "bg-paper-3 text-ink-muted"
                        : "bg-accent/15 text-accent"
                    }`}
                  >
                    {s.plan}
                  </span>
                  <span className="w-12 text-right font-mono text-sm text-ink">
                    {s.amount}
                  </span>
                  <span className="hidden w-16 text-right font-mono text-[11px] text-ink-faint sm:inline">
                    {s.when}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-line bg-paper-2 p-6 lg:col-span-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
              Plan mix
            </h2>
            <div className="mt-4 flex h-2.5 overflow-hidden rounded-full">
              {PLAN_MIX.map((p) => (
                <span
                  key={p.plan}
                  style={{ width: `${p.pct}%` }}
                  className={p.tone}
                />
              ))}
            </div>
            <ul className="mt-5 space-y-3">
              {PLAN_MIX.map((p) => (
                <li
                  key={p.plan}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 text-ink-muted">
                    <span className={`h-2.5 w-2.5 rounded-sm ${p.tone}`} />
                    {p.plan}
                  </span>
                  <span className="font-mono text-ink">{p.pct}%</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function RevenueChart() {
  return (
    <svg
      viewBox="0 0 720 200"
      preserveAspectRatio="none"
      className="mt-6 h-44 w-full"
      role="img"
      aria-label="Recognised revenue trending up over six months"
    >
      <defs>
        <linearGradient id="cds-dash-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 80, 120, 160].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="720"
          y2={y}
          stroke="var(--color-line)"
          strokeWidth="1"
        />
      ))}
      <path
        d="M0,168 L120,150 L240,156 L360,120 L480,96 L600,60 L720,28 L720,200 L0,200 Z"
        fill="url(#cds-dash-area)"
      />
      <path
        d="M0,168 L120,150 L240,156 L360,120 L480,96 L600,60 L720,28"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
