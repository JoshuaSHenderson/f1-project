import type { Driver, DriverChampionship } from "@/types/api.interfaces"
import type { FantasyLeague } from "@/types/FantasyLeague.interfaces"
import type { DriverRow, DriversChampionshipRows } from "@/components/driversChampionshipTable/DriversChampionship.interfaces"

export function getDriverChampionshipTableContent(
  fantasyLeague: FantasyLeague[],
  allDrivers: Driver[],
  driverChampionship: DriverChampionship[]
): DriversChampionshipRows[] {
  const driverChampionshipRows: DriversChampionshipRows[] = []
  fantasyLeague.forEach((team) => {
    const teamDrivers = getDrivers(team, allDrivers, driverChampionship)

    driverChampionshipRows.push({
      fantasyTeamName: team.fantasyTeamName,
      fantasyTeamPrincipal: team.fantasyTeamPrincipal,
      drivers: teamDrivers,
      totalPoints: getDriversChampionshipTotalPoints(teamDrivers),
    })
  })

  return driverChampionshipRows
}

function getDrivers(
  fantasyTeam: FantasyLeague,
  allDrivers: Driver[],
  driverChampionship: DriverChampionship[]
): DriverRow[] {
  const drivers: DriverRow[] = []
  fantasyTeam.driverNumbers.forEach((driver) => {
    const foundDriver = allDrivers.find((d) => d.driver_number == driver)

    if (!foundDriver) {
      return
    }

    const foundDriverPoints = driverChampionship.find(
      (dc) => dc.driver_number == foundDriver.driver_number
    )

    const foundDriverAsDriverRow: DriverRow = {
      driverName: foundDriver.full_name,
      driverNumber: foundDriver.driver_number,
      driverPoints: foundDriverPoints ? foundDriverPoints.points_current : 0,
      driverHeadshotUrl: foundDriver.headshot_url,
    }

    drivers.push(foundDriverAsDriverRow)
  })

  return drivers
}

function getDriversChampionshipTotalPoints(driversChampionship: DriverRow[]): number {
  let totalPoints = 0
  driversChampionship.forEach((driver) => {
    totalPoints += driver.driverPoints
  })

  return totalPoints
}
