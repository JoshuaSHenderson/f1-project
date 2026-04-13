import type { TeamChampionship } from "@/types/api.interfaces"
import type { FantasyLeague } from "@/types/FantasyLeague.interfaces"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer"
import { Button } from "../ui/button"
import { getTeamsChampionshipTableContent } from "./TeamsChampionshipTable.helper"
import type { TeamChampionshipRows } from "./TeamsChampionshipTable.interfaces"
import TeamPointsTable from "./teamsPointsTable/TeamPointsTable"
import { TableSkeleton } from "../ui/skeleton"

interface TeamsChampionshipTableProps {
  fantasyLeague: FantasyLeague[]
  teamChampionship: TeamChampionship[]
  isLoading?: boolean
}

export default function TeamsChampionshipTable(
  props: TeamsChampionshipTableProps
) {
  const teamsDataTableRows: TeamChampionshipRows[] =
    getTeamsChampionshipTableContent(
      props.fantasyLeague,
      props.teamChampionship
    ).sort((a, b) => b.totalPoints - a.totalPoints)

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Fantasy Constructors Championship
        </CardTitle>
      </CardHeader>
      <CardContent>
        {props.isLoading ? (
          <TableSkeleton
            numberOfColumns={5}
            numberOfRows={props.fantasyLeague.length}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Position
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Fantasy Team Name
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Fantasy Team Principal
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Fantasy Team Constructors
                </TableHead>
                <TableHead className="text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Total Points
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamsDataTableRows.map((team, index) => (
                <TableRow
                  key={team.fantasyTeamName}
                  className="even:bg-muted/30"
                >
                  <TableCell className="font-medium text-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {team.fantasyTeamName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {team.fantasyTeamPrincipal}
                  </TableCell>
                  <TableCell className="max-w-xs text-sm whitespace-normal text-muted-foreground">
                    <Drawer direction="right">
                      <DrawerTrigger asChild>
                        <Button variant="default">Team Points</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Team points</DrawerTitle>
                          <DrawerDescription>
                            Breakdown for {team.fantasyTeamName}.
                          </DrawerDescription>
                        </DrawerHeader>
                        <TeamPointsTable
                          teamRows={[...team.teams].sort(
                            (a, b) => b.points_current - a.points_current
                          )}
                        />
                      </DrawerContent>
                    </Drawer>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {team.totalPoints}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
