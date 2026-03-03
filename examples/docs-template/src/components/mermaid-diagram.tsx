"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"

interface MermaidDiagramProps {
  chart: string
  title?: string
}

export function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  const id = useId().replace(/:/g, "m")

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default

        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          fontFamily: "inherit",
          securityLevel: "loose",
        })

        const { svg: rendered } = await mermaid.render(
          `mermaid-${id}`,
          chart.trim()
        )

        if (!cancelled) {
          setSvg(rendered)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram")
          setSvg("")
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [chart, resolvedTheme, id])

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">
          Mermaid Error
        </p>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
        <pre className="mt-2 overflow-x-auto rounded bg-red-100 p-2 text-xs dark:bg-red-950/50">
          {chart}
        </pre>
      </div>
    )
  }

  return (
    <div className="group/code relative rounded-lg border bg-muted/50 overflow-hidden">
      {title && (
        <div className="flex items-center justify-between border-b bg-muted/80 px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            {title}
          </span>
          <CopyButton text={chart.trim()} />
        </div>
      )}
      {svg ? (
        <div
          ref={containerRef}
          className="flex items-center justify-center overflow-x-auto p-4 [&_svg]:max-w-full [&_svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="flex min-h-[100px] items-center justify-center p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            Rendering diagram...
          </div>
        </div>
      )}
    </div>
  )
}
