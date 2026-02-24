import Link from "next/link"
import { BookOpen, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span className="font-bold">YourProject</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/docs"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            href="/docs/api-reference"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            API
          </Link>
          <Link
            href="/docs/examples"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Examples
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/your-org/your-project"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
