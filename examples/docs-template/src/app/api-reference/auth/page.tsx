import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"
import { MethodSignature } from "@/components/method-signature"

export const metadata: Metadata = {
  title: "Auth API",
  description: "Authentication and session management API reference.",
}

const tocItems = [
  { title: "Setup", href: "#setup" },
  { title: "Methods", href: "#methods" },
  { title: "Types", href: "#types" },
  { title: "Examples", href: "#examples" },
]

export default function AuthApiPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Auth</h1>
          <p className="text-lg text-muted-foreground">
            Authentication flows, tokens, and session management.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          <section id="setup">
            <h2 className="text-2xl font-semibold tracking-tight">Setup</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              The Auth module requires the{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                @your-project/plugin-auth
              </code>{" "}
              plugin. Install and enable it in your configuration:
            </p>
            <div className="mt-4">
              <CodeBlock title="Terminal" lang="bash">npm install @your-project/plugin-auth</CodeBlock>
            </div>
            <div className="mt-4">
              <CodeBlock title="your-project.config.ts" lang="typescript">{`import { defineConfig } from "your-project"

export default defineConfig({
  apiKey: process.env.YOUR_PROJECT_API_KEY!,
  plugins: ["@your-project/plugin-auth"],
})`}</CodeBlock>
            </div>
          </section>

          <section id="methods">
            <h2 className="text-2xl font-semibold tracking-tight">Methods</h2>
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
              <MethodSignature
                name="client.auth.refresh"
                params="refreshToken: string"
                returnType="Promise&lt;Session&gt;"
                description="Exchanges a refresh token for a new session with fresh access and refresh tokens."
              />
            </div>
          </section>

          <section id="types">
            <h2 className="text-2xl font-semibold tracking-tight">Types</h2>
            <div className="mt-4">
              <CodeBlock title="Auth types" lang="typescript">{`interface Credentials {
  email: string
  password: string
}

interface SignUpInput {
  name: string
  email: string
  password: string
  role?: "admin" | "member" | "viewer"
}

interface Session {
  accessToken: string
  refreshToken: string
  expiresAt: Date
  user: User
}

interface TokenPayload {
  sub: string
  email: string
  role: string
  iat: number
  exp: number
}`}</CodeBlock>
            </div>
          </section>

          <section id="examples">
            <h2 className="text-2xl font-semibold tracking-tight">Examples</h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Sign up and sign in</h3>
                <div className="mt-3">
                  <CodeBlock title="auth-flow.ts" lang="typescript">{`import { client } from "./client"

// Sign up a new user
const { user, accessToken } = await client.auth.signUp({
  name: "Alice",
  email: "alice@example.com",
  password: "secure-password",
})

// Sign in an existing user
const session = await client.auth.signIn({
  email: "alice@example.com",
  password: "secure-password",
})

// Verify a token (e.g. in middleware)
const payload = await client.auth.verify(session.accessToken)
console.log("Authenticated user:", payload.sub)`}</CodeBlock>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Token refresh flow</h3>
                <div className="mt-3">
                  <CodeBlock title="refresh.ts" lang="typescript">{`import { client } from "./client"

// When the access token expires, use the refresh token
try {
  const newSession = await client.auth.refresh(session.refreshToken)
  console.log("New access token:", newSession.accessToken)
} catch (error) {
  // Refresh token expired — redirect to sign in
  console.log("Session expired, please sign in again")
}`}</CodeBlock>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/api-reference/storage"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Storage
          </Link>
          <div />
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
