"use client";

import { useEffect, useState } from "react";

/**
 * Minimal client-side "signed-in account" for the demo.
 *
 * There's no real auth server here, so we persist the account created at signup
 * (or during the simulated journey) in localStorage and let the nav reflect it.
 * SSR-safe: `useAccount` returns null on the first (server + hydration) render,
 * then fills in after mount — so the server-rendered logged-out nav and the
 * first client render match, avoiding a hydration mismatch.
 */

export type Account = {
  name: string;
  email: string;
  plan: string;
};

const KEY = "cadence.account";
const EVT = "cadence:account";

export function readAccount(): Account | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
}

export function saveAccount(account: Account): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(account));
  } catch {
    // ignore storage failures (private mode, quota) — demo only
  }
  window.dispatchEvent(new Event(EVT));
}

export function signOutAccount(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(EVT));
}

export function initials(account: Account): string {
  const source = account.name?.trim() || account.email;
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (letters || source.slice(0, 2)).toUpperCase();
}

export function useAccount(): Account | null {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const sync = () => setAccount(readAccount());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return account;
}
