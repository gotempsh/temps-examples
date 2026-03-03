import { Badge } from "@/components/ui/badge"

export function MethodSignature({
  name,
  params,
  returnType,
  description,
  badge,
}: {
  name: string
  params: string
  returnType: string
  description: string
  badge?: string
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start gap-2">
        <code className="font-mono text-sm font-medium">
          {name}({params})
        </code>
        {badge && (
          <Badge variant="secondary" className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      <div className="mt-2">
        <span className="text-xs text-muted-foreground">Returns: </span>
        <code className="font-mono text-xs text-muted-foreground">
          {returnType}
        </code>
      </div>
    </div>
  )
}
