
interface IDriverRow {
    DriverName: string
    DriverNumber: number
    DriverPoints: number
    DriverHeadShotUrl: URL
}

interface IDriversChampionshipRows {
    FantasyTeamName: string
    FantasyTeamPrincipal: string
    Drivers: IDriverRow[]
    TotalPoints: number

}

export type { IDriverRow, IDriversChampionshipRows }
