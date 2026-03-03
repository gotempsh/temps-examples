import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"
import { MethodSignature } from "@/components/method-signature"

export const metadata: Metadata = {
  title: "Users API",
  description: "User management API reference for YourProject.",
}

const tocItems = [
  { title: "Methods", href: "#methods" },
  { title: "Types", href: "#types" },
  { title: "Examples", href: "#examples" },
]

export default function UsersApiPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-lg text-muted-foreground">
            Manage users in your application.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          <section id="methods">
            <h2 className="text-2xl font-semibold tracking-tight">Methods</h2>
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
          </section>

          <section id="types">
            <h2 className="text-2xl font-semibold tracking-tight">Types</h2>
            <div className="mt-4">
              <CodeBlock title="User types" lang="typescript">{`interface User {
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
}

interface ListOptions {
  limit?: number
  offset?: number
  orderBy?: "createdAt" | "name" | "email"
  order?: "asc" | "desc"
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}`}</CodeBlock>
            </div>
          </section>

          <section id="examples">
            <h2 className="text-2xl font-semibold tracking-tight">Examples</h2>
            <div className="mt-4">
              <CodeBlock title="List and create users" lang="typescript">{`import { client } from "./client"

// List users with pagination
const { data: users, pagination } = await client.users.list({
  limit: 10,
  offset: 0,
  orderBy: "createdAt",
  order: "desc",
})

console.log(\`Showing \${users.length} of \${pagination.total} users\`)

// Create a new user
const newUser = await client.users.create({
  name: "Alice",
  email: "alice@example.com",
  role: "member",
})

// Update a user
const updated = await client.users.update(newUser.id, {
  role: "admin",
})`}</CodeBlock>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/api-reference/client"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Client
          </Link>
          <Link
            href="/api-reference/events"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            Events
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
