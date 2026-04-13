import { useMemo } from "react"
import type {
  IDriver,
  //   IDriverChampionship,
  ISession,
  ITeamChampionship,
} from "@/types/api.interfaces"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
// import FullSessionResults from "./fullRaceResults/fullRaceResults"
import type { SessionCircuitResults } from "@/types/FantasyLeague.interfaces"
import { SkeletonText, TableSkeleton } from "../ui/skeleton"
import FullTeamsSessionResults from "./fullTeamsRaceResults/FullTeamsRaceResults"
import { cn } from "@/lib/utils"

interface IFullDriversChampionshipTableProps {
  SessionCircuitResults: SessionCircuitResults[]
  Drivers: IDriver[]
  Sessions: ISession[]
  TeamChampionship: ITeamChampionship[]
  isLoading?: boolean
  isSessionResultsLoading?: boolean
}

export default function FullTeamsChampionshipTable(
  props: IFullDriversChampionshipTableProps
) {
  const TeamChamptionshipRows = useMemo(
    () =>
      [...props.TeamChampionship].sort(
        (a, b) => b.points_current - a.points_current
      ),
    [props.TeamChampionship]
  )

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Constructors Championship
        </CardTitle>
      </CardHeader>
      <CardContent>
        {props.isLoading ? (
          <TableSkeleton
            numberOfColumns={5}
            numberOfRows={
              props.TeamChampionship.length > 1
                ? props.TeamChampionship.length
                : 5
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Position
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Constructor
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Results
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Places Gained/Loss
                </TableHead>
                <TableHead className="text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Total Points
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TeamChamptionshipRows.map((team, index) => {
                const matchedDrivers = props.Drivers.filter(
                  (d) => d.team_name === team.team_name
                )
                const matched = matchedDrivers[0]
                const placesChange = formatPosistionsGainedOrLost(
                  GetPositionsGainedOrLost(team)
                )

                return (
                  <TableRow key={team.team_name} className="even:bg-muted/30">
                    {/* Posistion */}
                    <TableCell className="font-medium text-foreground">
                      {index + 1}
                    </TableCell>
                    {/* Constructor Name */}
                    <TableCell className="bold text-foreground">
                      <Badge
                        className="h-10 px-2.5 py-1 text-sm"
                        style={
                          matched?.team_colour
                            ? { backgroundColor: `#${matched.team_colour}` }
                            : undefined
                        }
                      >
                        {matched?.team_name ?? "—"}
                      </Badge>
                    </TableCell>
                    {/* Results */}
                    <TableCell className="max-w-xs text-sm whitespace-normal text-muted-foreground">
                      <Drawer direction="bottom">
                        <DrawerTrigger asChild>
                          {props.isSessionResultsLoading ? (
                            <>
                              <SkeletonText />
                            </>
                          ) : (
                            <Button variant="default" className="gap-2">
                              Full Race Results
                            </Button>
                          )}
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Race results</DrawerTitle>
                            <DrawerDescription>
                              Sessions for {team.team_name}.
                            </DrawerDescription>
                          </DrawerHeader>
                          <FullTeamsSessionResults
                            Drivers={matchedDrivers}
                            SessionResults={props.SessionCircuitResults}
                            Sessions={props.Sessions}
                            isLoading={props.isSessionResultsLoading}
                          />
                        </DrawerContent>
                      </Drawer>
                    </TableCell>
                    {/*Pos Gain*/}
                    <TableCell className="max-w-xs text-sm whitespace-normal">
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-7 min-w-9 justify-center border px-2.5 text-xs font-medium tabular-nums",
                          placesChange.className
                        )}
                      >
                        {placesChange.label}
                      </Badge>
                    </TableCell>
                    {/* Total Points */}
                    <TableCell className="text-left font-medium tabular-nums">
                      {team.points_current}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )

  function GetPositionsGainedOrLost(
    teamChampionship: ITeamChampionship
  ): number {
    return teamChampionship.position_start - teamChampionship.position_current
  }

  function formatPosistionsGainedOrLost(change: number): {
    label: string
    className: string
  } {
    if (!Number.isFinite(change) || change === 0) {
      return {
        label: "—",
        className:
          "border-border bg-muted/80 text-muted-foreground font-normal",
      }
    }
    if (change > 0) {
      return {
        label: `+${change}`,
        className:
          "border-emerald-500/40 bg-emerald-500/15 text-emerald-900 dark:border-emerald-400/35 dark:bg-emerald-500/20 dark:text-emerald-50",
      }
    }
    return {
      label: String(change),
      className:
        "border-red-500/40 bg-red-500/15 text-red-900 dark:border-red-400/35 dark:bg-red-500/20 dark:text-red-50",
    }
  }
}
