import { DocsSidebar } from "@/components/docs-sidebar"

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        <DocsSidebar />
        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
    </div>
  )
}
