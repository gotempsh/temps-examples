import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"

export const metadata: Metadata = {
  title: "Common Patterns",
  description: "Frequently used patterns and best practices with YourProject.",
}

const tocItems = [
  { title: "Middleware Pattern", href: "#middleware-pattern" },
  { title: "Batch Operations", href: "#batch-operations" },
  { title: "Error Boundaries", href: "#error-boundaries" },
  { title: "Singleton Client", href: "#singleton-client" },
]

export default function PatternsPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Common Patterns
          </h1>
          <p className="text-lg text-muted-foreground">
            Frequently used patterns and best practices.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          <section id="middleware-pattern">
            <h2 className="text-2xl font-semibold tracking-tight">
              Middleware Pattern
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Protect your API routes with an authentication middleware that
              verifies tokens before handling requests:
            </p>
            <div className="mt-4">
              <CodeBlock title="middleware.ts">{`import { client } from "./client"

// Create a reusable middleware
export function withAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    try {
      const session = await client.auth.verify(token)
      req.user = session.user
      return handler(req, res)
    } catch {
      return res.status(401).json({ error: "Invalid token" })
    }
  }
}`}</CodeBlock>
            </div>
          </section>

          <section id="batch-operations">
            <h2 className="text-2xl font-semibold tracking-tight">
              Batch Operations
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Process large datasets efficiently by splitting work into
              controlled batches:
            </p>
            <div className="mt-4">
              <CodeBlock title="batch.ts">{`import { client } from "./client"

// Process items in batches
async function batchCreateUsers(users: CreateUserInput[]) {
  const batchSize = 50
  const results = []

  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize)
    const created = await Promise.all(
      batch.map(user => client.users.create(user))
    )
    results.push(...created)
  }

  return results
}`}</CodeBlock>
            </div>
          </section>

          <section id="error-boundaries">
            <h2 className="text-2xl font-semibold tracking-tight">
              Error Boundaries
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Wrap operations in typed error handlers to gracefully recover from
              different failure modes:
            </p>
            <div className="mt-4">
              <CodeBlock title="error-boundary.ts">{`import { client } from "./client"
import {
  NotFoundError,
  ValidationError,
  RateLimitError,
} from "your-project"

async function safeGetUser(id: string) {
  try {
    return await client.users.get(id)
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null // User doesn't exist
    }
    if (error instanceof RateLimitError) {
      // Wait and retry
      await new Promise(r => setTimeout(r, error.retryAfter * 1000))
      return client.users.get(id)
    }
    if (error instanceof ValidationError) {
      console.error("Invalid input:", error.fields)
      throw error
    }
    throw error // Unknown error
  }
}`}</CodeBlock>
            </div>
          </section>

          <section id="singleton-client">
            <h2 className="text-2xl font-semibold tracking-tight">
              Singleton Client
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              In serverless environments, reuse a single client instance across
              invocations to take advantage of connection pooling:
            </p>
            <div className="mt-4">
              <CodeBlock title="client.ts">{`import { createClient, type Client } from "your-project"

let client: Client | null = null

export function getClient(): Client {
  if (!client) {
    client = createClient({
      apiKey: process.env.YOUR_PROJECT_API_KEY!,
      region: "us-east-1",
    })
  }
  return client
}`}</CodeBlock>
            </div>
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Tip
              </p>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                This pattern is especially important in serverless functions
                (AWS Lambda, Vercel Functions) where the module scope persists
                across warm invocations.
              </p>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/examples/starter-templates"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Starter Templates
          </Link>
          <Link
            href="/examples/deployment"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            Deployment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
