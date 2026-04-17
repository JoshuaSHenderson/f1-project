import { useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SessionResult, Driver } from "@/types/api.interfaces"
import TeamBadge from "@/components/ui/teamBadge"

interface SessionResultsTableProps {
  sessionResults: SessionResult[]
  drivers: Driver[]
}

export default function SessionResultsTable(props: SessionResultsTableProps) {
  const driversByNumber = useMemo(
    () => new Map(props.drivers.map((d) => [d.driver_number, d])),
    [props.drivers]
  )

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Gap to Leader</TableHead>
            <TableHead>DNF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.sessionResults.map((result) => {
            const driver = driversByNumber.get(result.driver_number)
            return (
              <TableRow key={result.driver_number}>
                <TableCell>{result.position}</TableCell>
                <TableCell>
                  {driver ? (
                    <div className="flex min-w-0 items-center gap-2">
                      <img
                        src={String(driver.headshot_url)}
                        alt={driver.full_name}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                      <span className="truncate">{driver.full_name}</span>
                    </div>
                  ) : null}
                </TableCell>
                <TableCell>
                  <TeamBadge
                    team_colour={driver?.team_colour}
                    team_name={driver?.team_name}
                  />
                </TableCell>
                <TableCell>{result.gap_to_leader}</TableCell>
                <TableCell>
                  {result.dnf || result.dns || result.dsq ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
