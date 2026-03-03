import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"
import { MethodSignature } from "@/components/method-signature"

export const metadata: Metadata = {
  title: "Client API",
  description: "Client initialization and configuration API reference.",
}

const tocItems = [
  { title: "createClient", href: "#create-client" },
  { title: "ClientConfig", href: "#client-config" },
  { title: "Client Instance", href: "#client-instance" },
]

export default function ClientApiPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Client</h1>
          <p className="text-lg text-muted-foreground">
            The main entry point for interacting with YourProject.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          <section id="create-client">
            <h2 className="text-2xl font-semibold tracking-tight">
              createClient
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Creates a new client instance with the given configuration. This is
              the primary way to initialize YourProject in your application.
            </p>
            <div className="mt-6 space-y-4">
              <MethodSignature
                name="createClient"
                params="config: ClientConfig"
                returnType="Client"
                description="Creates a new client instance with the given configuration."
              />
              <CodeBlock title="Example" lang="typescript">{`import { createClient } from "your-project"

const client = createClient({
  apiKey: process.env.YOUR_PROJECT_API_KEY!,
  region: "us-east-1",
})`}</CodeBlock>
            </div>
          </section>

          <section id="client-config">
            <h2 className="text-2xl font-semibold tracking-tight">
              ClientConfig
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Configuration options passed to{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                createClient
              </code>
              .
            </p>
            <div className="mt-4">
              <CodeBlock title="ClientConfig type" lang="typescript">{`interface ClientConfig {
  /** Your API key (required) */
  apiKey: string

  /** Server region. Defaults to "us-east-1" */
  region?: string

  /** Request timeout in milliseconds. Defaults to 30000 */
  timeout?: number

  /** Max retry attempts on failure. Defaults to 3 */
  maxRetries?: number

  /** Logging verbosity. Defaults to "info" */
  logLevel?: "debug" | "info" | "warn" | "error"

  /** Custom API base URL */
  baseUrl?: string

  /** Plugins to enable */
  plugins?: string[]
}`}</CodeBlock>
            </div>
          </section>

          <section id="client-instance">
            <h2 className="text-2xl font-semibold tracking-tight">
              Client Instance
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              The client instance exposes the following modules and methods:
            </p>
            <div className="mt-6 space-y-4">
              <MethodSignature
                name="client.configure"
                params="options: Partial&lt;ClientConfig&gt;"
                returnType="void"
                description="Updates the client configuration at runtime. Useful for changing settings without recreating the client."
              />
              <MethodSignature
                name="client.destroy"
                params=""
                returnType="Promise&lt;void&gt;"
                description="Gracefully shuts down the client, closing all connections and flushing pending requests."
              />
            </div>
            <div className="mt-4">
              <CodeBlock title="Available modules" lang="typescript">{`// The client instance provides access to all modules:
client.users    // User management
client.events   // Event streaming & webhooks
client.storage  // File storage & uploads
client.auth     // Authentication (requires plugin)`}</CodeBlock>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/api-reference"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Overview
          </Link>
          <Link
            href="/api-reference/users"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            Users
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
