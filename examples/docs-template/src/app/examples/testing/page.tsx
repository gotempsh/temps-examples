import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"

export const metadata: Metadata = {
  title: "Testing",
  description: "Test your YourProject integrations with the built-in test helpers.",
}

const tocItems = [
  { title: "Test Client", href: "#test-client" },
  { title: "Mocking Responses", href: "#mocking-responses" },
  { title: "Asserting Calls", href: "#asserting-calls" },
  { title: "Integration Tests", href: "#integration-tests" },
]

export default function TestingPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Testing</h1>
          <p className="text-lg text-muted-foreground">
            Test your integrations with the built-in test helpers.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          <section id="test-client">
            <h2 className="text-2xl font-semibold tracking-tight">
              Test Client
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              YourProject ships with a dedicated test client that makes it easy
              to mock API calls without hitting the network:
            </p>
            <div className="mt-4">
              <CodeBlock title="Terminal" lang="bash">npm install --save-dev your-project</CodeBlock>
            </div>
            <div className="mt-4">
              <CodeBlock title="setup.ts" lang="typescript">{`import { createTestClient } from "your-project/test"

// Create a test client — no API key needed
const client = createTestClient()

// The test client has the same API as the real client
// but all calls are intercepted and can be mocked`}</CodeBlock>
            </div>
          </section>

          <section id="mocking-responses">
            <h2 className="text-2xl font-semibold tracking-tight">
              Mocking Responses
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Mock any method to return predefined data:
            </p>
            <div className="mt-4">
              <CodeBlock title="__tests__/users.test.ts" lang="typescript">{`import { createTestClient } from "your-project/test"

const client = createTestClient()

describe("users", () => {
  it("should create a user", async () => {
    // Mock the response
    client.mock("users.create", {
      id: "usr_test",
      name: "Test User",
      email: "test@example.com",
    })

    const user = await client.users.create({
      name: "Test User",
      email: "test@example.com",
    })

    expect(user.id).toBe("usr_test")
  })

  it("should handle errors", async () => {
    // Mock an error response
    client.mockError("users.get", {
      code: "NOT_FOUND",
      message: "User not found",
    })

    await expect(client.users.get("usr_999"))
      .rejects.toThrow("User not found")
  })
})`}</CodeBlock>
            </div>
          </section>

          <section id="asserting-calls">
            <h2 className="text-2xl font-semibold tracking-tight">
              Asserting Calls
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Verify that specific methods were called with the expected
              arguments:
            </p>
            <div className="mt-4">
              <CodeBlock title="__tests__/assertions.test.ts" lang="typescript">{`import { createTestClient } from "your-project/test"

const client = createTestClient()

it("should track method calls", async () => {
  client.mock("users.create", { id: "usr_1" })

  await client.users.create({
    name: "Alice",
    email: "alice@example.com",
  })

  // Check call count
  expect(client.calls("users.create")).toHaveLength(1)

  // Inspect call arguments
  expect(client.calls("users.create")[0]).toEqual({
    name: "Alice",
    email: "alice@example.com",
  })

  // Reset all mocks and call history
  client.reset()
  expect(client.calls("users.create")).toHaveLength(0)
})`}</CodeBlock>
            </div>
          </section>

          <section id="integration-tests">
            <h2 className="text-2xl font-semibold tracking-tight">
              Integration Tests
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              For end-to-end testing against the actual API, use the real client
              with a test API key:
            </p>
            <div className="mt-4">
              <CodeBlock title="__tests__/integration.test.ts" lang="typescript">{`import { createClient } from "your-project"

const client = createClient({
  apiKey: process.env.YOUR_PROJECT_TEST_API_KEY!,
  region: "us-east-1",
})

describe("integration", () => {
  let userId: string

  it("should create and retrieve a user", async () => {
    const user = await client.users.create({
      name: "Integration Test User",
      email: \`test-\${Date.now()}@example.com\`,
    })

    userId = user.id
    expect(user.name).toBe("Integration Test User")

    const fetched = await client.users.get(userId)
    expect(fetched.id).toBe(userId)
  })

  afterAll(async () => {
    // Clean up test data
    if (userId) await client.users.delete(userId)
    await client.destroy()
  })
})`}</CodeBlock>
            </div>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Note
              </p>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                Use a separate test API key with limited permissions. Never run
                integration tests against your production environment.
              </p>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/examples/deployment"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Deployment
          </Link>
          <div />
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
