import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { IDriverRow } from "../DriversChampionship.interfaces"

interface IDriverPointsTableProps {
  DriverRows: IDriverRow[]
}


export default function DriverPointsTable(props: IDriverPointsTableProps) {
  return (
    <div className="mx-auto w-full max-w-xs sm:max-w-sm">
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
        {props.DriverRows.map((driver) => (
          <TableRow key={driver.DriverNumber} className="even:bg-muted/30">
            <TableCell className="font-medium text-foreground">
              <img
                src={String(driver.DriverHeadShotUrl)}
                alt={driver.DriverName}
                className="h-10 w-10 rounded-full object-cover"
              />
              {driver.DriverName}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {driver.DriverNumber}
            </TableCell>
            <TableCell className="text-right font-medium tabular-nums">
              {driver.DriverPoints}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  )
}
