import type { IDriver, IDriverChampionship } from "@/types/api.interfaces"
import type { IFantasyLeague } from "@/types/FantasyLeague.interfaces"
import { GetDriverChampionshipTableContent } from "./DriversChampionshipTable.helper"
import type { IDriversChampionshipRows } from "@/components/driversChampionshipTable/DriversChampionship.interfaces"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import DriverPointsTable from "./driverPointsTable/DriverPointsTable"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer"
import { Button } from "../ui/button"
import { TableSkeleton } from "../ui/skeleton"

interface IDriverChampionshipTableProps {
  Drivers: IDriver[]
  DriverChampionship: IDriverChampionship[]
  FantasyLeague: IFantasyLeague[]
  isLoading?: boolean
}

export default function DriverChampionshipTable(
  props: IDriverChampionshipTableProps
) {
  const driversDataTableRows: IDriversChampionshipRows[] =
    GetDriverChampionshipTableContent(
      props.FantasyLeague,
      props.Drivers,
      props.DriverChampionship
    ).sort((a, b) => b.TotalPoints - a.TotalPoints)

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Fantasy Drivers Championship
        </CardTitle>
      </CardHeader>
      <CardContent>
        {props.isLoading ? (
          <TableSkeleton
            numberOfColumns={5}
            numberOfRows={
              props.FantasyLeague.length > 1 ? props.FantasyLeague.length : 5
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
                  Fantasy Team Name
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Fantasy Team Principal
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Fantasy Team Drivers
                </TableHead>
                <TableHead className="text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Total Points
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {driversDataTableRows.map((team, index) => (
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
                        <Button variant="default">Driver Points</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Driver points</DrawerTitle>
                          <DrawerDescription>
                            Breakdown for {team.FantasyTeamName}.
                          </DrawerDescription>
                        </DrawerHeader>
                        <DriverPointsTable
                          DriverRows={[...team.Drivers].sort(
                            (a, b) => b.DriverPoints - a.DriverPoints
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
