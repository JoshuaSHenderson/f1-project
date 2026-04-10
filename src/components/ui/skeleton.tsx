import { cn } from "@/lib/utils"
import {
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  Table,
  TableCell,
} from "./table"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-2xl bg-muted", className)}
      {...props}
    />
  )
}

export function SkeletonText() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Skeleton className="h-4 w-full" />
    </div>
  )
}

export function TableSkeleton({
  numberOfColumns,
  numberOfRows,
}: {
  numberOfColumns: number
  numberOfRows: number
}) {
  const tableHeaders = Array.from({ length: numberOfColumns }, (_, index) => (
    <TableHead
      key={index}
      className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
    >
      <SkeletonText />
    </TableHead>
  ))

  const tableCells = Array.from({ length: numberOfColumns }, (_, index) => (
    <TableCell key={index} className="font-medium text-foreground">
      <SkeletonText />
    </TableCell>
  ))

  const tableRows = Array.from({ length: numberOfRows }, (_, index) => (
    <TableRow key={index} className="even:bg-muted/30">
      {tableCells}
    </TableRow>
  ))

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
            {tableHeaders}
          </TableRow>
        </TableHeader>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </div>
  )
}

export { Skeleton }
