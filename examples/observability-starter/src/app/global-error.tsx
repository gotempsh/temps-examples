"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Required by @sentry/nextjs to capture errors in the root layout / React tree.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          background: "#0a0a0a",
          color: "#ededed",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Something went wrong!
        </h2>
        <p style={{ color: "#a3a3a3" }}>
          This error was reported to Temps Error Tracking.
        </p>
        <button
          onClick={() => reset()}
          style={{
            borderRadius: "0.375rem",
            background: "#fff",
            color: "#000",
            padding: "0.5rem 1rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
