import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/lib/analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Temps Observability Starter",
  description:
    "A Next.js app pre-wired with Temps analytics, error tracking, distributed tracing, and a Postgres database.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Analytics provider wraps the whole app so pageviews and events are
            tracked automatically. */}
        <Analytics>{children}</Analytics>
      </body>
    </html>
  );
}
