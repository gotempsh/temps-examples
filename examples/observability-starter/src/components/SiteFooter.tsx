import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Revenue, the moment it moves.
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
          Cadence is a demo app for the Temps platform — every click in the
          simulated journey streams into analytics, traces, logs, and error
          tracking so you can see the whole stack light up.
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono">© 2026 Cadence · a Temps demo</span>
          <div className="flex gap-5 font-mono">
            <Link href="/pricing" className="transition-colors hover:text-ink">
              Pricing
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-ink">
              Dashboard
            </Link>
            <a
              href="https://temps.sh"
              className="transition-colors hover:text-ink"
            >
              temps.sh ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
