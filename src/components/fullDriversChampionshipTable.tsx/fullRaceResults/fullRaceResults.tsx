import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { IDriverChampionship, ISession } from "@/types/api.interfaces"
import type { SessionCircuitResults } from "@/types/FantasyLeague.interfaces"
import { useMemo } from "react"

interface IFullSessionResults {
  SessionResults: SessionCircuitResults[]
  Driver: IDriverChampionship
  Sessions: ISession[]
}

type RowModel = {
  block: SessionCircuitResults
  meta: ISession | undefined
}

export default function FullSessionResults(props: IFullSessionResults) {
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

    return list.sort((a, b) => {
      const ta = a.meta?.date_start
        ? new Date(a.meta.date_start as Date | string).getTime()
        : 0
      const tb = b.meta?.date_start
        ? new Date(b.meta.date_start as Date | string).getTime()
        : 0
      return ta - tb
    })
  }, [props.SessionResults, sessionsBySessionKey])

  if (rows.length === 0) {
    return (
      <p className="px-1 py-8 text-center text-sm text-muted-foreground">
        No session results available for this driver yet.
      </p>
    )
  }

  return (
    <div className="w-full min-w-0 px-1 pb-2 sm:px-2">
      <div className="overflow-hidden rounded-xl border border-border bg-card/30">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Event
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Session
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Location
              </TableHead>
              <TableHead className="text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Position
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ block: session, meta }) => {
              const sessionKey = session.sessionResults[0]?.session_key
              const position = session.sessionResults.find(
                (sr) => sr.driver_number === props.Driver.driver_number
              )?.position

              return (
                <TableRow
                  key={
                    sessionKey ??
                    `${session.circuit_key}-${session.circuit_short_name}`
                  }
                  className="even:bg-muted/30"
                >
                  <TableCell className="max-w-40 text-sm font-medium text-foreground whitespace-normal">
                    {session.circuit_short_name ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-normal">
                    {meta?.session_name ?? "—"}
                  </TableCell>
                  <TableCell className="max-w-48 text-sm text-muted-foreground whitespace-normal">
                    {[meta?.location, meta?.country_name]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium tabular-nums text-foreground">
                    {position ?? "—"}
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
