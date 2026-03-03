import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"
import { MethodSignature } from "@/components/method-signature"

export const metadata: Metadata = {
  title: "Events API",
  description: "Real-time event streaming and webhook API reference.",
}

const tocItems = [
  { title: "Methods", href: "#methods" },
  { title: "Types", href: "#types" },
  { title: "Examples", href: "#examples" },
]

export default function EventsApiPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-lg text-muted-foreground">
            Real-time event streaming and webhook management.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          <section id="methods">
            <h2 className="text-2xl font-semibold tracking-tight">Methods</h2>
            <div className="mt-6 space-y-4">
              <MethodSignature
                name="client.events.stream"
                params="options?: StreamOptions"
                returnType="AsyncIterable&lt;Event&gt;"
                description="Opens a real-time event stream. Supports automatic reconnection."
                badge="Streaming"
              />
              <MethodSignature
                name="client.events.on"
                params="type: string, handler: EventHandler"
                returnType="Unsubscribe"
                description="Registers a handler for a specific event type."
              />
              <MethodSignature
                name="client.events.emit"
                params="type: string, data: unknown"
                returnType="Promise&lt;Event&gt;"
                description="Emits a custom event that will be delivered to all subscribers."
              />
              <MethodSignature
                name="client.events.list"
                params="options?: ListEventsOptions"
                returnType="Promise&lt;Event[]&gt;"
                description="Returns a list of past events, optionally filtered by type or date range."
              />
            </div>
          </section>

          <section id="types">
            <h2 className="text-2xl font-semibold tracking-tight">Types</h2>
            <div className="mt-4">
              <CodeBlock title="Event types" lang="typescript">{`interface Event {
  id: string
  type: string
  data: unknown
  createdAt: Date
  source: "system" | "user" | "webhook"
}

interface StreamOptions {
  /** Filter events by type */
  types?: string[]
  /** Resume from a specific event ID */
  after?: string
  /** Auto-reconnect on disconnect. Defaults to true */
  reconnect?: boolean
}

type EventHandler = (event: Event) => void | Promise<void>
type Unsubscribe = () => void

interface ListEventsOptions {
  types?: string[]
  after?: Date
  before?: Date
  limit?: number
}`}</CodeBlock>
            </div>
          </section>

          <section id="examples">
            <h2 className="text-2xl font-semibold tracking-tight">Examples</h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Streaming events</h3>
                <div className="mt-3">
                  <CodeBlock title="streaming.ts" lang="typescript">{`import { client } from "./client"

// Stream all events with async iterator
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
              </div>
              <div>
                <h3 className="text-lg font-semibold">Event handlers</h3>
                <div className="mt-3">
                  <CodeBlock title="handlers.ts" lang="typescript">{`import { client } from "./client"

// Register typed event handlers
const unsubscribe = client.events.on("user.created", async (event) => {
  await sendWelcomeEmail(event.data.email)
})

// Emit custom events
await client.events.emit("order.completed", {
  orderId: "ord_123",
  total: 99.99,
})

// Clean up when done
unsubscribe()`}</CodeBlock>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/api-reference/users"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Users
          </Link>
          <Link
            href="/api-reference/storage"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            Storage
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
