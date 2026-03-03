import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Terminal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TableOfContents } from "@/components/table-of-contents"

export const metadata: Metadata = {
  title: "API Reference",
  description: "Complete API reference for YourProject.",
}

const tocItems = [
  { title: "Overview", href: "#overview" },
  { title: "Modules", href: "#modules" },
]

const modules = [
  {
    title: "Client",
    description: "Core client initialization and configuration options.",
    methods: ["createClient()", "client.configure()", "client.destroy()"],
    href: "/api-reference/client",
  },
  {
    title: "Users",
    description: "User management, authentication, and profile operations.",
    methods: ["users.list()", "users.get()", "users.create()", "users.update()", "users.delete()"],
    href: "/api-reference/users",
  },
  {
    title: "Events",
    description: "Real-time event streaming and webhook management.",
    methods: ["events.stream()", "events.on()", "events.emit()", "events.list()"],
    href: "/api-reference/events",
  },
  {
    title: "Storage",
    description: "File storage, uploads, and asset management.",
    methods: ["storage.upload()", "storage.get()", "storage.delete()", "storage.list()"],
    href: "/api-reference/storage",
  },
  {
    title: "Auth",
    description: "Authentication flows, tokens, and session management.",
    methods: ["auth.signIn()", "auth.signUp()", "auth.verify()", "auth.signOut()"],
    href: "/api-reference/auth",
  },
]

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

        <div className="space-y-12">
          <section id="overview">
            <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              The YourProject API is organized into modules, each handling a
              specific domain. All modules are accessed through the client
              instance created with{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                createClient()
              </code>
              . Every method is fully typed and returns promises for async
              operations.
            </p>
          </section>

          <section id="modules">
            <h2 className="text-2xl font-semibold tracking-tight">Modules</h2>
            <div className="mt-4 grid gap-4">
              {modules.map((mod) => (
                <Link key={mod.title} href={mod.href}>
                  <Card className="group transition-colors hover:border-foreground/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Terminal className="h-4 w-4 text-muted-foreground" />
                        {mod.title}
                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </CardTitle>
                      <CardDescription>{mod.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {mod.methods.map((method) => (
                          <code
                            key={method}
                            className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
                          >
                            {method}
                          </code>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
