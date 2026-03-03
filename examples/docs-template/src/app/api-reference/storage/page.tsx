import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { TableOfContents } from "@/components/table-of-contents"
import { CodeBlock } from "@/components/code-block"
import { MethodSignature } from "@/components/method-signature"

export const metadata: Metadata = {
  title: "Storage API",
  description: "File storage and asset management API reference.",
}

const tocItems = [
  { title: "Methods", href: "#methods" },
  { title: "Types", href: "#types" },
  { title: "Examples", href: "#examples" },
]

export default function StorageApiPage() {
  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Storage</h1>
          <p className="text-lg text-muted-foreground">
            File storage, uploads, and asset management.
          </p>
        </div>

        <hr className="my-8" />

        <div className="space-y-12">
          <section id="methods">
            <h2 className="text-2xl font-semibold tracking-tight">Methods</h2>
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
              <MethodSignature
                name="client.storage.getSignedUrl"
                params="key: string, options?: SignedUrlOptions"
                returnType="Promise&lt;string&gt;"
                description="Generates a time-limited signed URL for direct file access."
              />
            </div>
          </section>

          <section id="types">
            <h2 className="text-2xl font-semibold tracking-tight">Types</h2>
            <div className="mt-4">
              <CodeBlock title="Storage types" lang="typescript">{`interface StorageObject {
  key: string
  size: number
  contentType: string
  url: string
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, string>
}

interface UploadOptions {
  /** Storage key / path. Auto-generated if omitted */
  key?: string
  /** MIME type. Auto-detected if omitted */
  contentType?: string
  /** Custom metadata key-value pairs */
  metadata?: Record<string, string>
  /** Make the file publicly accessible */
  public?: boolean
}

interface SignedUrlOptions {
  /** URL expiration in seconds. Defaults to 3600 (1 hour) */
  expiresIn?: number
  /** Force download with this filename */
  downloadAs?: string
}`}</CodeBlock>
            </div>
          </section>

          <section id="examples">
            <h2 className="text-2xl font-semibold tracking-tight">Examples</h2>
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Upload a file</h3>
                <div className="mt-3">
                  <CodeBlock title="upload.ts" lang="typescript">{`import { client } from "./client"
import { readFileSync } from "fs"

// Upload from a buffer
const buffer = readFileSync("./photo.jpg")
const file = await client.storage.upload(buffer, {
  key: "uploads/photo.jpg",
  contentType: "image/jpeg",
  metadata: { userId: "usr_1" },
})

console.log("Uploaded to:", file.url)`}</CodeBlock>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Generate signed URLs</h3>
                <div className="mt-3">
                  <CodeBlock title="signed-url.ts" lang="typescript">{`import { client } from "./client"

// Generate a temporary download link
const url = await client.storage.getSignedUrl("uploads/photo.jpg", {
  expiresIn: 600, // 10 minutes
  downloadAs: "my-photo.jpg",
})

console.log("Download link:", url)`}</CodeBlock>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Pagination */}
        <hr className="my-8" />
        <div className="flex items-center justify-between">
          <Link
            href="/api-reference/events"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Events
          </Link>
          <Link
            href="/api-reference/auth"
            className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground"
          >
            Auth
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}
