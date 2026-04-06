import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


interface IDriverPointsTableProps{
    

}

export default function DriverPointsTable(props: IDriverPointsTableProps){
    return(        
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
              <TableCell  className="font-medium text-foreground">
                {team.FantasyTeamName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {team.FantasyTeamPrincipal}
              </TableCell>
              <TableCell className="max-w-xs text-sm whitespace-normal text-muted-foreground">
                {team.Drivers.map((d) => d.DriverName).join(", ")}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {team.TotalPoints}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
}