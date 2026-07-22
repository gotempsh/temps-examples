"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTempsAnalytics } from "@temps-sdk/react-analytics";
import { saveAccount } from "@/lib/account";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

const PLANS: Record<string, { name: string; price: string; mrr: number }> = {
  free: { name: "Free", price: "$0", mrr: 0 },
  pro: { name: "Pro", price: "$29/mo", mrr: 29 },
  scale: { name: "Scale", price: "$99/mo", mrr: 99 },
};

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const planKey = (params.get("plan") ?? "pro").toLowerCase();
  const plan = PLANS[planKey] ?? PLANS.pro;

  const { trackEvent } = useTempsAnalytics();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Swallow the SDK's promise so a suppressed/failed analytics beacon never
  // rejects into the submit flow.
  const fire = (result: unknown) => {
    if (result instanceof Promise) result.catch(() => {});
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    fire(trackEvent("signup_started", { plan: planKey }));

    // Best-effort: record the subscription. With a database attached this writes
    // a real row (a DB span + a metric + a request log land in Temps); in a
    // no-DB deploy it harmlessly returns 503. Either way the account is created
    // and we continue — the database is optional.
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, plan: planKey }),
      });
      if (res.ok) {
        fire(trackEvent("subscribed", { plan: planKey, mrr: plan.mrr }));
      }
    } catch {
      // network / DB unavailable — the demo account is still created below
    }

    fire(trackEvent("account_created", { plan: planKey }));
    // Sign the visitor in so the nav reflects their account.
    saveAccount({ name, email, plan: planKey });
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16 sm:py-24">
      <div className="rounded-2xl border border-line bg-paper-2 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-faint">
          Create your account
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
          Start with Cadence
        </h1>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-line bg-paper px-3.5 py-2.5">
          <span className="text-sm text-ink-muted">
            Selected plan · <span className="text-ink">{plan.name}</span>
          </span>
          <span className="font-mono text-sm text-accent">{plan.price}</span>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field
            label="Full name"
            id="name"
            value={name}
            onChange={setName}
            placeholder="Ada Lovelace"
            autoComplete="name"
          />
          <Field
            label="Work email"
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="ada@company.com"
            autoComplete="email"
          />
          <Field
            label="Company"
            id="company"
            value={company}
            onChange={setCompany}
            placeholder="Analytical Engines"
            autoComplete="organization"
            optional
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-70"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center font-mono text-[11px] text-ink-faint">
          Demo — no card required. Creating an account writes a real
          subscription to Postgres.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  optional,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  optional?: boolean;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
        {label}
        {optional ? <span className="normal-case">(optional)</span> : null}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={!optional}
        className="w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-visible:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus/50"
      />
    </label>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
