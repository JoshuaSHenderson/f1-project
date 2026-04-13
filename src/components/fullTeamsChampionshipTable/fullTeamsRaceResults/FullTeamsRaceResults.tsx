import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { IDriver, ISession } from "@/types/api.interfaces"
import type { SessionCircuitResults } from "@/types/FantasyLeague.interfaces"
import { TableLoadingState } from "@/components/ui/spinner"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface IFullTeamsSessionResults {
  SessionResults: SessionCircuitResults[]
  Drivers: IDriver[]
  Sessions: ISession[]
  isLoading?: boolean
}

type RowModel = {
  block: SessionCircuitResults
  meta: ISession | undefined
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

export default function FullTeamsSessionResults(
  props: IFullTeamsSessionResults
) {
  const sessionsBySessionKey = useMemo(
    () => new Map(props.Sessions.map((s) => [s.session_key, s])),
    [props.Sessions]
  )

  const rows = useMemo(() => {
    const list: RowModel[] = props.SessionResults.map((block) => {
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
  }, [props.SessionResults, sessionsBySessionKey])

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
    <div className="mx-auto w-full max-w-6xl min-w-0 px-1 pb-2 sm:px-2">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table className="min-w-[min(100%,520px)] text-sm">
          <TableHeader className="sticky top-0 z-1 shadow-[0_1px_0_0_hsl(var(--border))]">
            <TableRow className="border-b border-border bg-muted/60 hover:bg-muted/60">
              <TableHead className="h-11 min-w-[80px] pl-4 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Event
              </TableHead>
              <TableHead className="h-11 min-w-[80px] text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Venue
              </TableHead>
              <TableHead className="h-11 min-w-[80px] pr-4 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Driver
              </TableHead>
              <TableHead className="h-11 w-30 pr-4 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Results
              </TableHead>
              <TableHead className="h-11 w-30 pr-4 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Points
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ block: session, meta }) => {
              interface IDriverRow {
                Driver: IDriver
                Points: number
                Position: number
              }
              const driverRows: IDriverRow[] = []
              props.Drivers.map((d) => {
                const foundDriverResults = session.sessionResults.find(
                  (sr) => sr.driver_number === d.driver_number
                )
                const finishPosition = foundDriverResults?.position ?? 0
                const driverPoints =
                  finishPosition != null
                    ? positionToPoints(meta?.session_type ?? "", finishPosition)
                    : 0

                driverRows.push({
                  Driver: d,
                  Points: driverPoints,
                  Position: finishPosition,
                })
              })

              return (
                <TableRow
                  key={`${session.circuit_key}-${session.meeting_name}`}
                  className="border-border/80 transition-colors hover:bg-muted/40"
                >
                  {/* Event */}
                  <TableCell className="py-3 pl-4 align-top whitespace-normal">
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
                        <p className="leading-snug font-semibold text-foreground">
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
                  {/* Venue */}
                  <TableCell className="py-3 align-middle whitespace-normal">
                    <div className="flex flex-col gap-0.5">
                      <span className="leading-snug text-foreground">
                        {session.location || "—"}
                      </span>
                      <span className="text-xs leading-snug text-muted-foreground">
                        {session.country_name || ""}
                      </span>
                    </div>
                  </TableCell>
                  {/* Driver */}
                  <TableCell className="py-3 pr-4 text-right align-middle whitespace-normal">
                    <div className="flex min-w-0 flex-col gap-2">
                      {driverRows.map((driver) => (
                        <div
                          key={driver.Driver.driver_number}
                          className="flex min-w-0 items-center gap-2"
                        >
                          <img
                            src={String(driver.Driver.headshot_url)}
                            alt={
                              driver.Driver.full_name ??
                              `Driver ${driver.Driver.driver_number}`
                            }
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                          />
                          <span className="truncate">
                            {driver.Driver.full_name ??
                              `#${driver.Driver.driver_number}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  {/* Results */}
                  <TableCell className="py-3 pr-4 text-right align-middle whitespace-normal">
                    <div className="flex min-w-0 flex-col gap-2">
                      {driverRows.map((driver) => (
                        <div
                          key={driver.Driver.driver_number}
                          className="flex min-w-0 items-center gap-2"
                        >
                          <span
                            className={cn(
                              "inline-flex min-w-11 justify-center rounded-lg px-2.5 py-1.5 text-base font-semibold tracking-tight tabular-nums",
                              positionStyles(driver.Position)
                            )}
                          >
                            {driver.Position}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  {/* Points */}
                  <TableCell className="py-3 pr-4 text-right align-middle whitespace-normal">
                    {driverRows.map((driver) => (
                      <div
                        key={driver.Driver.driver_number}
                        className="flex min-w-0 items-center gap-2"
                      >
                        <span
                          className={cn(
                            "inline-flex min-w-11 justify-center rounded-lg px-2.5 py-1.5 text-base font-semibold tracking-tight tabular-nums"
                          )}
                        >
                          {driver.Points}
                        </span>
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  function positionToPoints(sessionType: string, position: number): number {
    const racePointsByPosition = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] as const
    const sprintPointsByPosition = [8, 7, 6, 5, 4, 3, 2, 1, 0, 0] as const
    if (position < 1 || position > 10) return 0
    const table =
      sessionType.toLocaleLowerCase() === "race"
        ? racePointsByPosition
        : sprintPointsByPosition
    return table[position - 1] ?? 0
  }
}
