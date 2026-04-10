import type { ITeamChampionship } from "@/types/api.interfaces"
import type { IFantasyLeague } from "@/types/FantasyLeague.interfaces"
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
import type { ITeamChampionshipRows } from "./TeamsChampionShipTable.interfaces"
import TeamPointsTable from "./teamsPointsTable/TeamPointsTable"
import { TableSkeleton } from "../ui/skeleton"

interface ITeamsChampionshipTableProps {
  FantasyLeague: IFantasyLeague[]
  TeamChampionship: ITeamChampionship[]
  IsLoading?: boolean
}

export default function TeamsChampionshipTable(
  props: ITeamsChampionshipTableProps
) {
  const teamsDataTableRows: ITeamChampionshipRows[] =
    getTeamsChampionshipTableContent(
      props.FantasyLeague,
      props.TeamChampionship
    ).sort((a, b) => b.TotalPoints - a.TotalPoints)

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Fantasy Constructors Championship
        </CardTitle>
      </CardHeader>
      <CardContent>
        {props.IsLoading ? (
          <TableSkeleton
            numberOfColumns={5}
            numberOfRows={props.FantasyLeague.length}
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
                  key={team.FantasyTeamName}
                  className="even:bg-muted/30"
                >
                  <TableCell className="font-medium text-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {team.FantasyTeamName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {team.FantasyTeamPrincipal}
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
                            Breakdown for {team.FantasyTeamName}.
                          </DrawerDescription>
                        </DrawerHeader>
                        <TeamPointsTable
                          TeamRows={[...team.Teams].sort(
                            (a, b) => b.points_current - a.points_current
                          )}
                        />
                      </DrawerContent>
                    </Drawer>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {team.TotalPoints}
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
