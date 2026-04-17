import { useMemo } from "react"
import type { Driver, Session, TeamChampionship } from "@/types/api.interfaces"
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
import type { SessionCircuitResults } from "@/types/FantasyLeague.interfaces"
import { SkeletonText, TableSkeleton } from "../ui/skeleton"
import FullTeamsSessionResults from "./fullTeamsRaceResults/FullTeamsRaceResults"
import { getPostionsValueAndClass } from "@/common/Helpers"
import PositionTableCell from "../ui/positionTableCell"

interface FullTeamsChampionshipTableProps {
  sessionCircuitResults: SessionCircuitResults[]
  drivers: Driver[]
  sessions: Session[]
  teamChampionship: TeamChampionship[]
  isLoading?: boolean
  isSessionResultsLoading?: boolean
}

export default function FullTeamsChampionshipTable(
  props: FullTeamsChampionshipTableProps
) {
  const teamChampionshipRows = useMemo(
    () =>
      [...props.teamChampionship].sort(
        (a, b) => b.points_current - a.points_current
      ),
    [props.teamChampionship]
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
              props.teamChampionship.length > 1
                ? props.teamChampionship.length
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
                <TableHead className="text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Total Points
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamChampionshipRows.map((team, index) => {
                const matchedDrivers = props.drivers.filter(
                  (d) => d.team_name === team.team_name
                )
                const matched = matchedDrivers[0]
                const placesChange = getPostionsValueAndClass(
                  team.position_start,
                  team.position_current
                )

                return (
                  <TableRow key={team.team_name} className="even:bg-muted/30">
                    {/* Position */}
                    <TableCell className="font-medium text-foreground">
                      <PositionTableCell
                        index={index}
                        placesChange={placesChange}
                      />
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
                            drivers={matchedDrivers}
                            sessionResults={props.sessionCircuitResults}
                            sessions={props.sessions}
                            isLoading={props.isSessionResultsLoading}
                          />
                        </DrawerContent>
                      </Drawer>
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
}
