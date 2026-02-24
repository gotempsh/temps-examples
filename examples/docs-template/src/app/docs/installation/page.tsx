import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"

export const metadata: Metadata = {
  title: "Installation",
  description: "Install YourProject and get started in minutes.",
}

const tocItems = [
  { title: "Package Manager", href: "#package-manager" },
  { title: "Peer Dependencies", href: "#peer-dependencies" },
  { title: "TypeScript Setup", href: "#typescript-setup" },
  { title: "Verify Installation", href: "#verify-installation" },
]

export default function InstallationPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
          <p className="text-lg text-muted-foreground">
            How to install and configure YourProject in your application.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          {/* Package Manager */}
          <section id="package-manager">
            <h2 className="text-2xl font-semibold tracking-tight">
              Package Manager
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Install YourProject using your preferred package manager:
            </p>
            <div className="mt-4">
              <Tabs defaultValue="npm" className="w-full">
                <TabsList>
                  <TabsTrigger value="npm">npm</TabsTrigger>
                  <TabsTrigger value="yarn">yarn</TabsTrigger>
                  <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                  <TabsTrigger value="bun">bun</TabsTrigger>
                </TabsList>
                <TabsContent value="npm">
                  <CodeBlock lang="bash">npm install your-project</CodeBlock>
                </TabsContent>
                <TabsContent value="yarn">
                  <CodeBlock lang="bash">yarn add your-project</CodeBlock>
                </TabsContent>
                <TabsContent value="pnpm">
                  <CodeBlock lang="bash">pnpm add your-project</CodeBlock>
                </TabsContent>
                <TabsContent value="bun">
                  <CodeBlock lang="bash">bun add your-project</CodeBlock>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Peer Dependencies */}
          <section id="peer-dependencies">
            <h2 className="text-2xl font-semibold tracking-tight">
              Peer Dependencies
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              YourProject has minimal peer dependencies. Make sure you have the
              following installed:
            </p>
            <div className="mt-4">
              <CodeBlock title="Terminal">npm install typescript@^5.0</CodeBlock>
            </div>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Note
              </p>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                TypeScript is optional but strongly recommended. YourProject
                includes type definitions that provide excellent IDE support and
                catch errors at compile time.
              </p>
            </div>
          </section>

          {/* TypeScript Setup */}
          <section id="typescript-setup">
            <h2 className="text-2xl font-semibold tracking-tight">
              TypeScript Setup
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              If you&apos;re using TypeScript, add the following to your{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                tsconfig.json
              </code>
              :
            </p>
            <div className="mt-4">
              <CodeBlock title="tsconfig.json">{`{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "target": "ES2017",
    "lib": ["ES2017", "DOM"]
  }
}`}</CodeBlock>
            </div>
          </section>

          {/* Verify Installation */}
          <section id="verify-installation">
            <h2 className="text-2xl font-semibold tracking-tight">
              Verify Installation
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Create a simple script to verify everything is working:
            </p>
            <div className="mt-4">
              <CodeBlock title="test.ts">{`import { createClient } from "your-project"

const client = createClient({
  apiKey: "test_key",
})

console.log("YourProject version:", client.version)
// => "YourProject version: 2.0.0"`}</CodeBlock>
            </div>
            <p className="mt-4 leading-7 text-muted-foreground">
              Run the script to confirm the installation:
            </p>
            <div className="mt-4">
              <CodeBlock title="Terminal">npx tsx test.ts</CodeBlock>
            </div>
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/30">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Success
              </p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                If you see the version number printed, you&apos;re all set! Head
                over to the Quick Start guide to build your first integration.
              </p>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/docs"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Introduction
          </Link>
          <Link
            href="/docs/getting-started"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            Quick Start
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
