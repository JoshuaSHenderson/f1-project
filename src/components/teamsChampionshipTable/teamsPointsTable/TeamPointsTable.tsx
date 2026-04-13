import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TeamChampionship } from "@/types/api.interfaces"

interface TeamPointsTableProps {
  teamRows: TeamChampionship[]
}

export default function TeamPointsTable(props: TeamPointsTableProps) {
  return (
    <div className="w-max">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Name
            </TableHead>
            <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Current Position
            </TableHead>
            <TableHead className="text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Total Points
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.teamRows.map((team) => (
            <TableRow key={team.team_name} className="even:bg-muted/30">
              <TableCell className="font-medium text-foreground">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate">{team.team_name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {team.position_current}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {team.points_current}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
