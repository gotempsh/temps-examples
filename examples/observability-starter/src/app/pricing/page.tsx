import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

type Plan = {
  slug: string;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    slug: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "For a side project finding its first paying users.",
    features: [
      "Up to 1,000 tracked events / mo",
      "Live MRR & subscriber count",
      "7-day history",
      "1 teammate",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    price: "$29",
    cadence: "/mo",
    blurb: "For a growing SaaS that runs on its revenue numbers.",
    features: [
      "Unlimited events",
      "Funnel & churn analytics",
      "12-month history",
      "Slack & email alerts",
      "5 teammates",
    ],
    featured: true,
  },
  {
    slug: "scale",
    name: "Scale",
    price: "$99",
    cadence: "/mo",
    blurb: "For a team that needs cohorts, exports, and controls.",
    features: [
      "Everything in Pro",
      "Cohort retention & forecasting",
      "Data warehouse export",
      "Roles & audit log",
      "Unlimited teammates",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-faint">
            Pricing
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Simple pricing that scales with revenue.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            Start free. Upgrade when the numbers make it obvious. No per-seat
            surprises.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.slug}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.featured
                  ? "border-accent/60 bg-paper-2 ring-1 ring-accent/40"
                  : "border-line bg-paper-2"
              }`}
            >
              {plan.featured ? (
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-ink">
                  Most popular
                </span>
              ) : null}

              <h2 className="font-mono text-sm uppercase tracking-[0.16em] text-ink-muted">
                {plan.name}
              </h2>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-mono text-4xl font-semibold tracking-tight text-ink">
                  {plan.price}
                </span>
                <span className="font-mono text-sm text-ink-faint">
                  {plan.cadence}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {plan.blurb}
              </p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 text-accent" aria-hidden>
                      ✓
                    </span>
                    <span className="text-ink-muted">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/signup?plan=${plan.slug}`}
                className={`mt-8 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                  plan.featured
                    ? "bg-accent text-accent-ink"
                    : "border border-line-strong text-ink hover:bg-paper-3"
                }`}
              >
                Choose {plan.name}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          Sample pricing for the demo
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
