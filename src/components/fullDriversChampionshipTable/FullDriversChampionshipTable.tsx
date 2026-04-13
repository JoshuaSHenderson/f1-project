import { useMemo } from "react"
import type { Driver, DriverChampionship, Session } from "@/types/api.interfaces"
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
import FullSessionResults from "./fullRaceResults/fullRaceResults"
import type { SessionCircuitResults } from "@/types/FantasyLeague.interfaces"
import { SkeletonText, TableSkeleton } from "../ui/skeleton"

interface FullDriversChampionshipTableProps {
  sessionCircuitResults: SessionCircuitResults[]
  drivers: Driver[]
  sessions: Session[]
  driverChampionship: DriverChampionship[]
  isLoading?: boolean
  isSessionResultsLoading?: boolean
}

export default function FullDriversChampionshipTable(
  props: FullDriversChampionshipTableProps
) {
  const driversByNumber = useMemo(
    () => new Map(props.drivers.map((d) => [d.driver_number, d])),
    [props.drivers]
  )

  const driverChampionshipRows = useMemo(
    () =>
      [...props.driverChampionship].sort(
        (a, b) => b.points_current - a.points_current
      ),
    [props.driverChampionship]
  )

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Drivers Championship
        </CardTitle>
      </CardHeader>
      <CardContent>
        {props.isLoading ? (
          <TableSkeleton
            numberOfColumns={5}
            numberOfRows={props.drivers.length > 1 ? props.drivers.length : 5}
          />
        ) : (
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
                            matched?.full_name ??
                            `Driver ${driver.driver_number}`
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
                              Sessions for{" "}
                              {matched?.full_name ??
                                `driver #${driver.driver_number}`}
                              .
                            </DrawerDescription>
                          </DrawerHeader>
                          <FullSessionResults
                            driver={driver}
                            sessionResults={props.sessionCircuitResults}
                            sessions={props.sessions}
                            isLoading={props.isSessionResultsLoading}
                          />
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
        )}
      </CardContent>
    </Card>
  )
}
