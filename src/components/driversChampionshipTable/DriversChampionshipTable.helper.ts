import type { IDriver, IDriverChampionship } from "@/types/api.interfaces";
import type { IFantasyLeague } from "@/types/FantasyLeague.interfaces";
import type { IDriverRow, IDriversChampionshipRows } from "@/components/driversChampionshipTable/DriversChampionship.interfaces"

export function GetDriverChampionshipTableContent(
    fantasyLeague: IFantasyLeague[],
    allDrivers: IDriver[],
    driverChampionship: IDriverChampionship[]
): IDriversChampionshipRows[] {

    const driversChamptionshipRows: IDriversChampionshipRows[] = []
    fantasyLeague.forEach(team => {

        const teamDrivers = GetDrivers(team, allDrivers, driverChampionship)

        driversChamptionshipRows.push({
            FantasyTeamName: team.FantasyTeamName,
            FantasyTeamPrincipal: team.FantasyTeamPrincipal,
            Drivers: teamDrivers,
            TotalPoints: GetDriversChampionshipTotalPoints(teamDrivers)
        })
    });

    return driversChamptionshipRows
}

function GetDrivers(
    fantasyTeam: IFantasyLeague,
    allDrivers: IDriver[],
    driverChampionship: IDriverChampionship[]
): IDriverRow[] {

    const drivers: IDriverRow[] = []
    fantasyTeam.DriverNumbers.forEach(driver => {
        const foundDriver = allDrivers.find((d) => d.driver_number == driver)

        if (!foundDriver) {
            return
        }

        const foundDriverPoints = driverChampionship.find((dc) => dc.driver_number == foundDriver.driver_number)

        const foundDriverAsDriverRow: IDriverRow = {
            DriverName: foundDriver.full_name,
            DriverNumber: foundDriver.driver_number,
            DriverPoints: foundDriverPoints ? foundDriverPoints.points_current : 0,
            DriverHeadShotUrl: foundDriver.headshot_url,
        }

        drivers.push(foundDriverAsDriverRow)

    });

    return drivers
}

function GetDriversChampionshipTotalPoints(
    driversChampionship: IDriverRow[]
): number {
    let totalPoints = 0
    driversChampionship.forEach(driver => {
        totalPoints += driver.DriverPoints
    });

    return totalPoints

};
