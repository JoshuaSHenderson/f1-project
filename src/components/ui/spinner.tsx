import { cn } from "@/lib/utils"

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "size-8 shrink-0 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-primary",
        className
      )}
    />
  )
}

export function TableLoadingState({
  message = "Loading…",
  className,
}: {
  message?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-48 flex-col items-center justify-center gap-3 py-10",
        className
      )}
    >
      <Spinner className="size-10" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
