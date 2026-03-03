import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Changelog",
}

const releases = [
  {
    version: "2.0.0",
    date: "2025-12-01",
    tag: "Latest",
    changes: [
      "Added streaming support for real-time event consumption",
      "New plugin system with official plugin registry",
      "Improved TypeScript type inference with generics",
      "Breaking: Renamed `init()` to `createClient()` for clarity",
      "Breaking: Minimum Node.js version is now 18",
    ],
  },
  {
    version: "1.5.0",
    date: "2025-09-15",
    changes: [
      "Added `storage.upload()` with multipart support",
      "New retry configuration with exponential backoff",
      "Improved error messages with actionable suggestions",
      "Added `client.configure()` for runtime config changes",
    ],
  },
  {
    version: "1.4.0",
    date: "2025-07-20",
    changes: [
      "Added `auth.verify()` for token validation",
      "New `events.on()` method for event listeners",
      "Performance improvements for large query results",
      "Fixed memory leak in long-running stream connections",
    ],
  },
  {
    version: "1.3.0",
    date: "2025-05-10",
    changes: [
      "Added user management APIs (`users.create()`, `users.update()`)",
      "New configuration file format with `defineConfig()`",
      "Added region selection for multi-region deployments",
      "Improved documentation with interactive examples",
    ],
  },
  {
    version: "1.0.0",
    date: "2025-01-15",
    tag: "Initial Release",
    changes: [
      "Core client with type-safe API",
      "User listing and retrieval",
      "Basic event system",
      "TypeScript and JavaScript support",
      "Comprehensive documentation",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">Changelog</h1>
      <p className="mt-4 text-muted-foreground">
        All notable changes to YourProject are documented here.
      </p>

      <div className="mt-12 space-y-12">
        {releases.map((release) => (
          <div key={release.version} className="relative border-l-2 border-border pl-6">
            <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">v{release.version}</h2>
              {release.tag && (
                <Badge variant="secondary" className="text-xs">
                  {release.tag}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{release.date}</p>
            <ul className="mt-4 space-y-2">
              {release.changes.map((change) => (
                <li
                  key={change}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mr-2 text-foreground/40">&bull;</span>
                  {change}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
