interface DriverRow {
  driverName: string
  driverNumber: number
  driverPoints: number
  driverHeadshotUrl: URL
}

interface DriversChampionshipRows {
  fantasyTeamName: string
  fantasyTeamPrincipal: string
  drivers: DriverRow[]
  totalPoints: number
}

export type { DriverRow, DriversChampionshipRows }
