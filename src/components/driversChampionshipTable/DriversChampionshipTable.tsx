import type {
  IDriver,
  IDriverChampionship,
  ISession,
} from "@/types/api.interfaces"
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
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer"
import { Button } from "../ui/button"

interface IDriverChampionshipTableProps {
  session: ISession[]
  drivers: IDriver[]
  driverChampionship: IDriverChampionship[]
  fantasyLeague: IFantasyLeague[]
}

export default function DriverChampionshipTable(
  props: IDriverChampionshipTableProps
) {
  const driversDataTableRows: IDriversChampionshipRows[] =
    GetDriverChampionshipTableContent(
      props.fantasyLeague,
      props.drivers,
      props.driverChampionship
    )

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Drivers Championship
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
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
            {driversDataTableRows.map((team) => (
              <TableRow key={team.FantasyTeamName} className="even:bg-muted/30">
                <TableCell className="font-medium text-foreground">
                  {team.FantasyTeamName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {team.FantasyTeamPrincipal}
                </TableCell>
                <TableCell className="max-w-xs text-sm whitespace-normal text-muted-foreground">
                  <Drawer direction="right">
                    <DrawerTrigger>
                      <Button variant="default">Driver Points</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DriverPointsTable DriverRows={team.Drivers} />
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
      </CardContent>
    </Card>
  )
}
