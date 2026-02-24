import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"

export const metadata: Metadata = {
  title: "API Reference",
  description: "Complete API reference for YourProject.",
}

const tocItems = [
  { title: "Client", href: "#client" },
  { title: "Users", href: "#users" },
  { title: "Events", href: "#events" },
  { title: "Storage", href: "#storage" },
  { title: "Auth", href: "#auth" },
]

function MethodSignature({
  name,
  params,
  returnType,
  description,
  badge,
}: {
  name: string
  params: string
  returnType: string
  description: string
  badge?: string
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start gap-2">
        <code className="font-mono text-sm font-medium">
          {name}({params})
        </code>
        {badge && (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      <div className="mt-2">
        <span className="text-xs text-muted-foreground">Returns: </span>
        <code className="font-mono text-xs text-muted-foreground">
          {returnType}
        </code>
      </div>
    </div>
  )
}

export default function ApiReferencePage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">API Reference</h1>
          <p className="text-lg text-muted-foreground">
            Complete reference for all YourProject methods and types.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-16">
          {/* Client */}
          <section id="client">
            <h2 className="text-2xl font-semibold tracking-tight">Client</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              The main entry point for interacting with YourProject.
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
            <Separator className="mt-8" />
          </section>

          {/* Users */}
          <section id="users">
            <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Manage users in your application.
            </p>
            <div className="mt-6 space-y-4">
              <MethodSignature
                name="client.users.list"
                params="options?: ListOptions"
                returnType="Promise&lt;PaginatedResponse&lt;User&gt;&gt;"
                description="Returns a paginated list of users."
              />
              <MethodSignature
                name="client.users.get"
                params="id: string"
                returnType="Promise&lt;User&gt;"
                description="Retrieves a single user by their unique ID."
              />
              <MethodSignature
                name="client.users.create"
                params="data: CreateUserInput"
                returnType="Promise&lt;User&gt;"
                description="Creates a new user with the given data."
              />
              <MethodSignature
                name="client.users.update"
                params="id: string, data: UpdateUserInput"
                returnType="Promise&lt;User&gt;"
                description="Updates an existing user. Supports partial updates."
              />
              <MethodSignature
                name="client.users.delete"
                params="id: string"
                returnType="Promise&lt;void&gt;"
                description="Permanently deletes a user."
                badge="Destructive"
              />
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Types</h3>
              <div className="mt-3">
                <CodeBlock title="User type" lang="typescript">{`interface User {
  id: string
  name: string
  email: string
  role: "admin" | "member" | "viewer"
  createdAt: Date
  updatedAt: Date
}

interface CreateUserInput {
  name: string
  email: string
  role?: "admin" | "member" | "viewer"
}

interface UpdateUserInput {
  name?: string
  email?: string
  role?: "admin" | "member" | "viewer"
}`}</CodeBlock>
              </div>
            </div>
            <Separator className="mt-8" />
          </section>

          {/* Events */}
          <section id="events">
            <h2 className="text-2xl font-semibold tracking-tight">Events</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Real-time event streaming and webhook management.
            </p>
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
            </div>
            <Separator className="mt-8" />
          </section>

          {/* Storage */}
          <section id="storage">
            <h2 className="text-2xl font-semibold tracking-tight">Storage</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              File storage, uploads, and asset management.
            </p>
            <div className="mt-6 space-y-4">
              <MethodSignature
                name="client.storage.upload"
                params="file: File | Buffer, options?: UploadOptions"
                returnType="Promise&lt;StorageObject&gt;"
                description="Uploads a file to storage. Supports streaming uploads for large files."
              />
              <MethodSignature
                name="client.storage.get"
                params="key: string"
                returnType="Promise&lt;StorageObject&gt;"
                description="Retrieves metadata and a download URL for a stored file."
              />
              <MethodSignature
                name="client.storage.delete"
                params="key: string"
                returnType="Promise&lt;void&gt;"
                description="Permanently deletes a file from storage."
                badge="Destructive"
              />
              <MethodSignature
                name="client.storage.list"
                params="prefix?: string"
                returnType="Promise&lt;StorageObject[]&gt;"
                description="Lists all files, optionally filtered by a key prefix."
              />
            </div>
            <Separator className="mt-8" />
          </section>

          {/* Auth */}
          <section id="auth">
            <h2 className="text-2xl font-semibold tracking-tight">Auth</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Authentication flows, tokens, and session management.
              Requires the{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                @your-project/plugin-auth
              </code>{" "}
              plugin.
            </p>
            <div className="mt-6 space-y-4">
              <MethodSignature
                name="client.auth.signIn"
                params="credentials: Credentials"
                returnType="Promise&lt;Session&gt;"
                description="Authenticates a user and creates a new session."
              />
              <MethodSignature
                name="client.auth.signUp"
                params="data: SignUpInput"
                returnType="Promise&lt;User &amp; Session&gt;"
                description="Creates a new user account and signs them in."
              />
              <MethodSignature
                name="client.auth.verify"
                params="token: string"
                returnType="Promise&lt;TokenPayload&gt;"
                description="Verifies a JWT token and returns its decoded payload."
              />
              <MethodSignature
                name="client.auth.signOut"
                params=""
                returnType="Promise&lt;void&gt;"
                description="Invalidates the current session and clears auth tokens."
              />
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/docs/configuration"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Configuration
          </Link>
          <Link
            href="/docs/examples"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            Examples
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
