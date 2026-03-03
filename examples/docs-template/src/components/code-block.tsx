import { codeToHtml } from "shiki"
import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"
import { MermaidDiagram } from "./mermaid-diagram"

interface CodeBlockProps {
  children: string
  title?: string
  lang?: string
}

/**
 * Infer the language from the file title extension, falling back to "text".
 */
function inferLang(title?: string): string {
  if (!title) return "text"
  const ext = title.split(".").pop()?.toLowerCase()
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    json: "json",
    env: "bash",
    sh: "bash",
    bash: "bash",
    dockerfile: "dockerfile",
    yaml: "yaml",
    yml: "yaml",
    md: "markdown",
    css: "css",
    html: "html",
  }
  const lower = title.toLowerCase()
  // Handle special title names
  if (lower === "terminal") return "bash"
  if (lower === "dockerfile") return "dockerfile"
  return ext ? (map[ext] || "text") : "text"
}

export async function CodeBlock({ children, title, lang }: CodeBlockProps) {
  const language = lang || inferLang(title)
  const code = children.trim()

  if (language === "mermaid") {
    return <MermaidDiagram chart={code} title={title} />
  }

  const html = await codeToHtml(code, {
    lang: language,
    themes: {
      light: "github-light-default",
      dark: "github-dark-default",
    },
  })

  return (
    <div className="group/code relative rounded-lg border bg-muted/50 overflow-hidden">
      {title && (
        <div className="flex items-center justify-between border-b bg-muted/80 px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            {title}
          </span>
          <CopyButton text={code} />
        </div>
      )}
      {!title && (
        <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover/code:opacity-100">
          <CopyButton text={code} />
        </div>
      )}
      <div
        className={cn(
          "[&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed",
          "[&_pre]:!bg-transparent",
          "[&_code]:font-mono [&_code]:text-[13px]",
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
