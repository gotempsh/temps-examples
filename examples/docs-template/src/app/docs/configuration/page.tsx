import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"

export const metadata: Metadata = {
  title: "Configuration",
  description: "Configure YourProject for your use case.",
}

const tocItems = [
  { title: "Configuration File", href: "#configuration-file" },
  { title: "Options Reference", href: "#options-reference" },
  { title: "Environment Variables", href: "#environment-variables" },
  { title: "Plugins", href: "#plugins" },
]

export default function ConfigurationPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
          <p className="text-lg text-muted-foreground">
            Customize YourProject to fit your application&apos;s needs.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          {/* Configuration File */}
          <section id="configuration-file">
            <h2 className="text-2xl font-semibold tracking-tight">
              Configuration File
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Create a{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                your-project.config.ts
              </code>{" "}
              file in your project root for centralized configuration:
            </p>
            <div className="mt-4">
              <CodeBlock title="your-project.config.ts">{`import { defineConfig } from "your-project"

export default defineConfig({
  // Required
  apiKey: process.env.YOUR_PROJECT_API_KEY!,

  // Optional - Connection settings
  region: "us-east-1",
  timeout: 30_000, // 30 seconds
  maxRetries: 3,

  // Optional - Logging
  logLevel: "info", // "debug" | "info" | "warn" | "error"

  // Optional - Plugins
  plugins: [
    "@your-project/plugin-auth",
    "@your-project/plugin-cache",
  ],
})`}</CodeBlock>
            </div>
          </section>

          {/* Options Reference */}
          <section id="options-reference">
            <h2 className="text-2xl font-semibold tracking-tight">
              Options Reference
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Complete list of configuration options:
            </p>
            <div className="mt-4 rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Option</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Default</th>
                    <th className="px-4 py-3 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { option: "apiKey", type: "string", default: "-", description: "Your API key (required)" },
                    { option: "region", type: "string", default: '"us-east-1"', description: "Server region" },
                    { option: "timeout", type: "number", default: "30000", description: "Request timeout in ms" },
                    { option: "maxRetries", type: "number", default: "3", description: "Max retry attempts" },
                    { option: "logLevel", type: "string", default: '"info"', description: "Logging verbosity" },
                    { option: "plugins", type: "string[]", default: "[]", description: "Plugin list" },
                    { option: "baseUrl", type: "string", default: "auto", description: "Custom API base URL" },
                  ].map((row, i) => (
                    <tr key={row.option} className={i < 6 ? "border-b" : ""}>
                      <td className="px-4 py-3">
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                          {row.option}
                        </code>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {row.type}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {row.default}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Environment Variables */}
          <section id="environment-variables">
            <h2 className="text-2xl font-semibold tracking-tight">
              Environment Variables
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              All configuration options can also be set via environment
              variables. Environment variables take precedence over the config
              file.
            </p>
            <div className="mt-4">
              <CodeBlock title=".env">{`YOUR_PROJECT_API_KEY=sk_live_abc123
YOUR_PROJECT_REGION=us-east-1
YOUR_PROJECT_LOG_LEVEL=debug
YOUR_PROJECT_TIMEOUT=60000`}</CodeBlock>
            </div>
          </section>

          {/* Plugins */}
          <section id="plugins">
            <h2 className="text-2xl font-semibold tracking-tight">
              Plugins
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Extend functionality with official plugins:
            </p>
            <div className="mt-4 space-y-4">
              {[
                {
                  name: "@your-project/plugin-auth",
                  description: "Adds authentication helpers, session management, and OAuth support.",
                },
                {
                  name: "@your-project/plugin-cache",
                  description: "Intelligent caching layer with TTL, invalidation, and stale-while-revalidate.",
                },
                {
                  name: "@your-project/plugin-metrics",
                  description: "Performance monitoring, request tracing, and usage analytics.",
                },
              ].map((plugin) => (
                <div
                  key={plugin.name}
                  className="rounded-lg border p-4"
                >
                  <code className="font-mono text-sm font-medium">
                    {plugin.name}
                  </code>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plugin.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/docs/getting-started"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Quick Start
          </Link>
          <div />
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
