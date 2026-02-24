import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"

export const metadata: Metadata = {
  title: "Quick Start",
  description: "Build your first integration with YourProject in 5 minutes.",
}

const tocItems = [
  { title: "Create a Client", href: "#create-a-client" },
  { title: "Fetch Data", href: "#fetch-data" },
  { title: "Create Resources", href: "#create-resources" },
  { title: "Handle Errors", href: "#handle-errors" },
  { title: "Stream Events", href: "#stream-events" },
  { title: "Next Steps", href: "#next-steps" },
]

export default function GettingStartedPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Quick Start</h1>
          <p className="text-lg text-muted-foreground">
            Build your first integration with YourProject in 5 minutes.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          {/* Create a Client */}
          <section id="create-a-client">
            <h2 className="text-2xl font-semibold tracking-tight">
              Create a Client
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Start by importing and initializing the client with your API key.
              You can get your API key from the{" "}
              <span className="font-medium text-foreground underline underline-offset-4 cursor-pointer">
                dashboard
              </span>
              .
            </p>
            <div className="mt-4">
              <CodeBlock title="src/client.ts">{`import { createClient } from "your-project"

export const client = createClient({
  apiKey: process.env.YOUR_PROJECT_API_KEY!,
  region: "us-east-1", // optional, defaults to "us-east-1"
})`}</CodeBlock>
            </div>
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/30">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Tip
              </p>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Store your API key in environment variables. Never commit API
                keys directly in your source code.
              </p>
            </div>
          </section>

          {/* Fetch Data */}
          <section id="fetch-data">
            <h2 className="text-2xl font-semibold tracking-tight">
              Fetch Data
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Use the client to query data. All methods return typed responses
              and support pagination out of the box.
            </p>
            <div className="mt-4">
              <CodeBlock title="src/example.ts">{`import { client } from "./client"

// List users with pagination
const { data: users, pagination } = await client.users.list({
  limit: 10,
  offset: 0,
  orderBy: "createdAt",
  order: "desc",
})

console.log(users)
// => [{ id: "usr_1", name: "Alice", ... }, ...]

// Get a single user by ID
const user = await client.users.get("usr_1")
console.log(user.name)
// => "Alice"`}</CodeBlock>
            </div>
          </section>

          {/* Create Resources */}
          <section id="create-resources">
            <h2 className="text-2xl font-semibold tracking-tight">
              Create Resources
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Create new resources with type-safe input validation. The client
              validates inputs before sending requests to the API.
            </p>
            <div className="mt-4">
              <CodeBlock title="src/create-user.ts">{`import { client } from "./client"

const newUser = await client.users.create({
  name: "Bob",
  email: "bob@example.com",
  role: "member", // TypeScript will autocomplete valid roles
})

console.log(newUser.id)
// => "usr_2"`}</CodeBlock>
            </div>
          </section>

          {/* Handle Errors */}
          <section id="handle-errors">
            <h2 className="text-2xl font-semibold tracking-tight">
              Handle Errors
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              YourProject provides typed error classes for different failure
              modes. Use standard try/catch to handle them gracefully.
            </p>
            <div className="mt-4">
              <CodeBlock title="src/error-handling.ts">{`import { client } from "./client"
import { NotFoundError, ValidationError, RateLimitError } from "your-project"

try {
  const user = await client.users.get("usr_nonexistent")
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("User not found:", error.resourceId)
  } else if (error instanceof ValidationError) {
    console.log("Invalid input:", error.fields)
  } else if (error instanceof RateLimitError) {
    console.log("Rate limited. Retry after:", error.retryAfter)
  } else {
    throw error // Re-throw unknown errors
  }
}`}</CodeBlock>
            </div>
          </section>

          {/* Stream Events */}
          <section id="stream-events">
            <h2 className="text-2xl font-semibold tracking-tight">
              Stream Events
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Subscribe to real-time events using async iterators. Events are
              automatically reconnected on connection loss.
            </p>
            <div className="mt-4">
              <CodeBlock title="src/streaming.ts">{`import { client } from "./client"

// Stream all events
for await (const event of client.events.stream()) {
  switch (event.type) {
    case "user.created":
      console.log("New user:", event.data.name)
      break
    case "user.updated":
      console.log("Updated user:", event.data.id)
      break
    default:
      console.log("Event:", event.type)
  }
}`}</CodeBlock>
            </div>
          </section>

          {/* Next Steps */}
          <section id="next-steps">
            <h2 className="text-2xl font-semibold tracking-tight">
              Next Steps
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Now that you have the basics down, explore these resources:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/docs/configuration"
                  className="text-sm font-medium underline underline-offset-4 hover:text-foreground"
                >
                  Configuration Guide
                </Link>
                <span className="text-sm text-muted-foreground">
                  {" "}
                  &mdash; Customize client behavior, timeouts, and retries
                </span>
              </li>
              <li>
                <Link
                  href="/docs/api-reference"
                  className="text-sm font-medium underline underline-offset-4 hover:text-foreground"
                >
                  API Reference
                </Link>
                <span className="text-sm text-muted-foreground">
                  {" "}
                  &mdash; Complete documentation for all methods
                </span>
              </li>
              <li>
                <Link
                  href="/docs/examples"
                  className="text-sm font-medium underline underline-offset-4 hover:text-foreground"
                >
                  Examples
                </Link>
                <span className="text-sm text-muted-foreground">
                  {" "}
                  &mdash; Real-world use cases and patterns
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/docs/installation"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Installation
          </Link>
          <Link
            href="/docs/configuration"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            Configuration
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
