import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { DriverChampionship, Session } from "@/types/api.interfaces"
import type { SessionCircuitResults } from "@/types/FantasyLeague.interfaces"
import { TableLoadingState } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface FullSessionResultsProps {
  sessionResults: SessionCircuitResults[]
  driver: DriverChampionship
  sessions: Session[]
  isLoading?: boolean
}

type RowModel = {
  block: SessionCircuitResults
  meta: Session | undefined
}

function positionStyles(position: number | undefined): string {
  if (position === 1) {
    return "bg-amber-500/20 text-amber-950 dark:bg-amber-500/25 dark:text-amber-100"
  }
  if (position === 2) {
    return "bg-zinc-400/20 text-zinc-900 dark:bg-zinc-400/15 dark:text-zinc-100"
  }
  if (position === 3) {
    return "bg-orange-700/15 text-orange-950 dark:bg-orange-600/20 dark:text-orange-100"
  }
  return "bg-muted/80 text-foreground"
}

export default function FullSessionResults(props: FullSessionResultsProps) {
  const sessionsBySessionKey = useMemo(
    () => new Map(props.sessions.map((s) => [s.session_key, s])),
    [props.sessions]
  )

  const rows = useMemo(() => {
    const list: RowModel[] = props.sessionResults.map((block) => {
      const sessionKey = block.sessionResults[0]?.session_key
      const meta =
        sessionKey !== undefined
          ? sessionsBySessionKey.get(sessionKey)
          : undefined
      return { block, meta }
    })

    // Newest session first (descending by session start time)
    return list.sort((a, b) => {
      const ta = a.meta?.date_start
        ? new Date(a.meta.date_start as Date | string).getTime()
        : 0
      const tb = b.meta?.date_start
        ? new Date(b.meta.date_start as Date | string).getTime()
        : 0
      return tb - ta
    })
  }, [props.sessionResults, sessionsBySessionKey])

  if (props.isLoading && rows.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-1 sm:px-2">
        <TableLoadingState
          message="Loading session results…"
          className="min-h-32 py-6"
        />
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-1 sm:px-2">
        <p className="py-8 text-center text-sm text-muted-foreground">
          No session results available for this driver yet.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-2xl px-1 pb-2 sm:px-2">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table className="min-w-[min(100%,520px)] text-sm">
          <TableHeader className="sticky top-0 z-1 shadow-[0_1px_0_0_hsl(var(--border))]">
            <TableRow className="border-b border-border bg-muted/60 hover:bg-muted/60">
              <TableHead className="h-11 min-w-[200px] pl-4 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Event
              </TableHead>
              <TableHead className="h-11 min-w-[120px] text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Venue
              </TableHead>
              <TableHead className="h-11 w-18 pr-4 text-right text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Pos
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ block: session, meta }) => {
              const sessionKey = session.sessionResults[0]?.session_key
              const position = session.sessionResults.find(
                (sr) => sr.driver_number === props.driver.driver_number
              )?.position

              return (
                <TableRow
                  key={
                    sessionKey ??
                    `${session.circuit_key}-${session.meeting_name}`
                  }
                  className="border-border/80 transition-colors hover:bg-muted/40"
                >
                  <TableCell className="whitespace-normal py-3 pl-4 align-top">
                    <div className="flex gap-3">
                      <div className="relative shrink-0">
                        {session.circuit_image ? (
                          <img
                            src={session.circuit_image}
                            alt=""
                            className="h-14 w-18 rounded-lg border border-border/80 bg-muted object-cover shadow-sm"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="flex h-14 w-18 items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-xs text-muted-foreground"
                            aria-hidden
                          >
                            —
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col justify-center gap-1.5">
                        <p className="font-semibold leading-snug text-foreground">
                          {session.meeting_name || "—"}
                        </p>
                        {meta?.session_name ? (
                          <Badge
                            variant="secondary"
                            className="h-6 w-fit px-2 text-[11px]"
                          >
                            {meta.session_name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-normal py-3 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <span className="leading-snug text-foreground">
                        {session.location || "—"}
                      </span>
                      <span className="text-xs leading-snug text-muted-foreground">
                        {session.country_name || ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-normal py-3 pr-4 text-right align-middle">
                    {position != null ? (
                      <span
                        className={cn(
                          "inline-flex min-w-11 justify-center rounded-lg px-2.5 py-1.5 text-base font-semibold tabular-nums tracking-tight",
                          positionStyles(position)
                        )}
                      >
                        {position}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
