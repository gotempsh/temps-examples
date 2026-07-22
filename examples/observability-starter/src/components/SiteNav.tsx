"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { initials, signOutAccount, useAccount } from "@/lib/account";

const LINKS = [
  { href: "/", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const account = useAccount();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-accent font-mono text-sm font-bold text-accent-ink">
            c
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight text-ink">
            cadence
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                isActive(l.href)
                  ? "text-ink"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {account ? (
            <>
              <Link
                href="/dashboard"
                title={account.email}
                className="flex items-center gap-2 rounded-full border border-line bg-paper-2 py-1 pl-1 pr-1 transition-colors hover:border-line-strong sm:pr-3"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-accent-ink">
                  {initials(account)}
                </span>
                <span className="hidden max-w-[10rem] truncate text-sm text-ink sm:inline">
                  {account.name || account.email}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  signOutAccount();
                  router.push("/");
                }}
                className="rounded-md px-2.5 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="hidden rounded-md px-3 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink sm:inline-block"
              >
                Sign in
              </Link>
              <Link
                href="/signup?plan=pro"
                className="rounded-md bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
