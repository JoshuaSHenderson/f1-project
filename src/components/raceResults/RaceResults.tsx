import type { SessionCircuitResults } from "@/types/FantasyLeague.interfaces"
import type { Session, Driver, SessionResult } from "@/types/api.interfaces"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { useMemo } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import { CaretDownIcon, TrophyIcon } from "@phosphor-icons/react"
import SessionResultsTable from "./sessionResults/SessionResultsTable"

interface RaceResultsProps {
  sessionResults: SessionCircuitResults[]
  sessions: Session[]
  drivers: Driver[]
  isLoading?: boolean
}

interface SessionResultRow {
  driverNumber: number
  position: number
  duration: number
  gapToLeader: string
  numberOfLaps: number
  dnf: boolean
  dns: boolean
  dsq: boolean
  meeting_key: number
  session_key: number
}

export default function RaceResults(props: RaceResultsProps) {
  console.log("session", props.sessions)
  console.log("sessionResults", props.sessionResults)
  const sessionResultsRows = useMemo(() => {
    const uniqueCircuitKeys = Array.from(
      new Set(props.sessionResults.map((r) => r.circuit_key))
    )
    return uniqueCircuitKeys.map((circuitKey) => {
      const result = props.sessionResults.find(
        (r) => r.circuit_key === circuitKey
      )
      const circuitSessions = props.sessions.filter(
        (s) => s.circuit_key === circuitKey
      )
      const sortedSessions = [...circuitSessions].sort(
        (a, b) =>
          new Date(a.date_start as Date | string).getTime() -
          new Date(b.date_start as Date | string).getTime()
      )
      const weekendStart = sortedSessions[0]?.date_start
      const weekendEnd = sortedSessions[sortedSessions.length - 1]?.date_start
      return {
        circuitKey,
        circuitName: result?.meeting_name ?? "",
        circuitImage: result?.circuit_image,
        location: result?.location ?? "",
        countryName: result?.country_name ?? "",
        circuitShortName: circuitSessions[0]?.circuit_short_name ?? "",
        year: circuitSessions[0]?.year,
        weekendStart,
        weekendEnd,
        sessions: circuitSessions.map((s) => ({
          sessionName: s.session_name,
          sessionType: s.session_type,
          sessionDate: new Date(
            s.date_start as Date | string
          ).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          sessionResults: result?.sessionResults.map((r) => ({
            driverNumber: r.driver_number,
            position: r.position,
            duration: r.duration,
            gapToLeader: r.gap_to_leader,
            numberOfLaps: r.number_of_laps,
            dnf: r.dnf,
            dns: r.dns,
            dsq: r.dsq,
            meeting_key: s.meeting_key,
            session_key: s.session_key,
          })),
        })),
      }
    })
  }, [props.sessionResults, props.sessions])

  function getWinner(
    sessionResults: SessionResultRow[] | undefined
  ): Driver | undefined {
    if (!sessionResults) return undefined
    const winner = sessionResults.find((r) => r.position === 1)
    return winner
      ? props.drivers.find((d) => d.driver_number === winner.driverNumber)
      : undefined
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {sessionResultsRows.map((circuit) => (
        <Collapsible key={circuit.circuitName} className="group/race w-full">
          <CollapsibleTrigger className="w-full text-left">
            <Card size="sm" className="transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {circuit.circuitImage ? (
                      <img
                        src={circuit.circuitImage}
                        alt={circuit.circuitName}
                        className="h-16 w-16 shrink-0 rounded-md bg-muted object-contain p-1.5"
                      />
                    ) : null}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <CardTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        {circuit.circuitName}
                        {circuit.year ? (
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            {circuit.year}{" "}
                          </span>
                        ) : null}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                        {circuit.circuitShortName ? (
                          <span className="font-medium text-foreground">
                            {circuit.circuitShortName}
                          </span>
                        ) : null}
                        {(circuit.location || circuit.countryName) && (
                          <span className="text-muted-foreground">
                            {[circuit.location, circuit.countryName]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        )}
                        {circuit.weekendStart ? (
                          <span className="text-muted-foreground">
                            &middot;{" "}
                            {new Date(
                              circuit.weekendStart as Date | string
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                            {circuit.weekendEnd &&
                            new Date(
                              circuit.weekendEnd as Date | string
                            ).toDateString() !==
                              new Date(
                                circuit.weekendStart as Date | string
                              ).toDateString()
                              ? ` – ${new Date(
                                  circuit.weekendEnd as Date | string
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}`
                              : ""}
                          </span>
                        ) : null}
                      </CardDescription>
                    </div>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover/race:bg-muted group-hover/race:text-foreground">
                      <CaretDownIcon
                        weight="bold"
                        className="size-4 transition-transform duration-300 ease-out group-aria-expanded/race:-rotate-180"
                      />
                    </span>
                  </div>
                </CardHeader>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent>
                <Card>
                  <CardContent>
                    {circuit.sessions.map((session) => (
                      <Collapsible
                        key={session.sessionName}
                        className="group/session border-b border-border/60 last:border-b-0"
                      >
                        <CollapsibleTrigger className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40">
                          <div className="flex min-w-0 flex-1 flex-col">
                            <CardTitle className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                              {session.sessionName}
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                              {session.sessionDate}
                            </CardDescription>
                          </div>
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover/session:bg-muted group-hover/session:text-foreground">
                            <CaretDownIcon
                              weight="bold"
                              className="size-4 transition-transform duration-300 ease-out group-aria-expanded/session:-rotate-180"
                            />
                          </span>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          {(() => {
                            const winner = getWinner(session.sessionResults)
                            const teamColour = winner?.team_colour
                              ? `#${winner.team_colour}`
                              : undefined
                            return (
                              <div className="mb-4 flex items-center gap-4 rounded-lg border border-border/60 bg-muted/30 p-4">
                                <TrophyIcon
                                  weight="fill"
                                  className="size-6 shrink-0 text-amber-500"
                                />
                                {winner ? (
                                  <>
                                    {winner.headshot_url ? (
                                      <img
                                        src={String(winner.headshot_url)}
                                        alt={winner.full_name}
                                        className="size-20 shrink-0 rounded-full object-cover ring-2 ring-offset-2 ring-offset-background sm:size-24"
                                        style={
                                          teamColour
                                            ? {
                                                boxShadow: `0 0 0 2px ${teamColour}`,
                                              }
                                            : undefined
                                        }
                                      />
                                    ) : null}
                                    <div className="flex min-w-0 flex-1 flex-col">
                                      <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Race Winner
                                      </span>
                                      <CardTitle className="truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                        {winner.full_name}
                                      </CardTitle>
                                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
                                        {winner.name_acronym ? (
                                          <span
                                            className="rounded px-1.5 py-0.5 text-xs font-semibold text-white"
                                            style={
                                              teamColour
                                                ? {
                                                    backgroundColor: teamColour,
                                                  }
                                                : undefined
                                            }
                                          >
                                            {winner.name_acronym}
                                          </span>
                                        ) : null}
                                        {winner.team_name ? (
                                          <span className="truncate">
                                            {winner.team_name}
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                      Race Winner
                                    </span>
                                    <CardTitle className="text-2xl font-bold tracking-tight text-muted-foreground">
                                      Unknown
                                    </CardTitle>
                                  </div>
                                )}
                              </div>
                            )
                          })()}

                          <div className="pb-4">
                            <SessionResultsTable
                              drivers={props.drivers}
                              sessionResults={
                                session.sessionResults?.map((r) => ({
                                  driver_number: r.driverNumber,
                                  position: r.position ?? 0,
                                  duration: r.duration ?? 0,
                                  gap_to_leader: r.gapToLeader ?? "",
                                  number_of_laps: r.numberOfLaps ?? 0,
                                  dnf: r.dnf ?? false,
                                  dns: r.dns ?? false,
                                  dsq: r.dsq ?? false,
                                  meeting_key: r.meeting_key ?? 0,
                                  session_key: r.session_key ?? 0,
                                })) ?? ([] as SessionResult[])
                              }
                            />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
