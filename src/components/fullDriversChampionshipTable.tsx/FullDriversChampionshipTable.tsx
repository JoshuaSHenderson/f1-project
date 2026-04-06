import { useMemo } from "react"
import type {
  IDriver,
  IDriverChampionship,
  ISession,
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
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

interface IFullDriversChampionshipTableProps {
  Session: ISession[]
  Drivers: IDriver[]
  DriverChampionship: IDriverChampionship[]
}

export default function FullDriversChampionshipTable(
  props: IFullDriversChampionshipTableProps
) {
  const driversByNumber = useMemo(
    () => new Map(props.Drivers.map((d) => [d.driver_number, d])),
    [props.Drivers]
  )

  const driverChampionshipRows = useMemo(
    () =>
      [...props.DriverChampionship].sort(
        (a, b) => b.points_current - a.points_current
      ),
    [props.DriverChampionship]
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
                Position
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Driver
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Team
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Results
              </TableHead>
              <TableHead className="text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Total Points
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {driverChampionshipRows.map((driver, index) => {
              const matched = driversByNumber.get(driver.driver_number)
              return (
                <TableRow
                  key={driver.driver_number}
                  className="even:bg-muted/30"
                >
                  <TableCell className="font-medium text-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    <div className="flex min-w-0 items-center gap-2">
                      <img
                        src={matched ? String(matched.headshot_url) : ""}
                        alt={
                          matched?.full_name ?? `Driver ${driver.driver_number}`
                        }
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                      <span className="truncate">
                        {matched?.full_name ?? `#${driver.driver_number}`}
                      </span>
                    </div>
                  </TableCell>
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
                  <TableCell className="max-w-xs text-sm whitespace-normal text-muted-foreground">
                    <Drawer direction="right">
                      <DrawerTrigger>
                        <Button variant="default">Full Race Results</Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        {/* <DriverPointsTable
                        DriverRows={[...team.Drivers].sort(
                          (a, b) => b.DriverPoints - a.DriverPoints
                        )}
                      /> */}
                      </DrawerContent>
                    </Drawer>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {driver.points_current}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
