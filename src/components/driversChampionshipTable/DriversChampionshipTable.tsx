import type { Driver, DriverChampionship } from "@/types/api.interfaces"
import type { FantasyLeague } from "@/types/FantasyLeague.interfaces"
import { getDriverChampionshipTableContent } from "./DriversChampionshipTable.helper"
import type { DriversChampionshipRows } from "@/components/driversChampionshipTable/DriversChampionship.interfaces"
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

interface DriverChampionshipTableProps {
  drivers: Driver[]
  driverChampionship: DriverChampionship[]
  fantasyLeague: FantasyLeague[]
  isLoading?: boolean
}

export default function DriverChampionshipTable(
  props: DriverChampionshipTableProps
) {
  const driversDataTableRows: DriversChampionshipRows[] =
    getDriverChampionshipTableContent(
      props.fantasyLeague,
      props.drivers,
      props.driverChampionship
    ).sort((a, b) => b.totalPoints - a.totalPoints)

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
              props.fantasyLeague.length > 1 ? props.fantasyLeague.length : 5
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
                        <Button variant="default">Driver Points</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Driver points</DrawerTitle>
                          <DrawerDescription>
                            Breakdown for {team.fantasyTeamName}.
                          </DrawerDescription>
                        </DrawerHeader>
                        <DriverPointsTable
                          driverRows={[...team.drivers].sort(
                            (a, b) => b.driverPoints - a.driverPoints
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
