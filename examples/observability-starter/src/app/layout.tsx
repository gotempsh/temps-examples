import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@/lib/analytics";
import { SimulateProvider } from "@/components/SimulateProvider";
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
  title: "Cadence — revenue analytics for SaaS teams",
  description:
    "Cadence is a demo SaaS app for the Temps platform: track MRR, subscribers, churn, and the signup-to-paid funnel. Hit Simulate to watch analytics, traces, logs, and error tracking light up in Temps.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Analytics provider wraps the whole app so pageviews and events are
            tracked automatically. SimulateProvider sits inside it (so it can
            fire events) and stays mounted across route changes, which lets the
            simulated journey drive real navigations while its progress overlay
            persists. */}
        <Analytics>
          <SimulateProvider>{children}</SimulateProvider>
        </Analytics>
      </body>
    </html>
  );
}
