import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DriverRow } from "../DriversChampionship.interfaces"

interface DriverPointsTableProps {
  driverRows: DriverRow[]
}

export default function DriverPointsTable(props: DriverPointsTableProps) {
  return (
    <div className="w-max">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Name
            </TableHead>
            <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Number
            </TableHead>
            <TableHead className="text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Total Points
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.driverRows.map((driver) => (
            <TableRow key={driver.driverNumber} className="even:bg-muted/30">
              <TableCell className="font-medium text-foreground">
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    src={String(driver.driverHeadshotUrl)}
                    alt={driver.driverName}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                  <span className="truncate">{driver.driverName}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {driver.driverNumber}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {driver.driverPoints}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
