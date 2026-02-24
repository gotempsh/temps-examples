"use client"

import { cn } from "@/lib/utils"

interface TocItem {
  title: string
  href: string
  level?: number
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] py-6 pl-6">
        <h4 className="mb-3 text-sm font-semibold">On this page</h4>
        <nav>
          <ul className="space-y-1.5">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "block text-sm text-muted-foreground transition-colors hover:text-foreground",
                    item.level && item.level > 2 && "pl-4"
                  )}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
