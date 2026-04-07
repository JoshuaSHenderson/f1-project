import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ITeamChampionship } from "@/types/api.interfaces"

interface IDriverPointsTableProps {
  TeamRows: ITeamChampionship[]
}

export default function TeamPointsTable(props: IDriverPointsTableProps) {
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
          {props.TeamRows.map((team) => (
            <TableRow key={team.team_name} className="even:bg-muted/30">
              <TableCell className="font-medium text-foreground">
                <div className="flex min-w-0 items-center gap-2">
                  {/* <img
                    src={String(team.)}
                    alt={team.DriverName}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  /> */}
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
