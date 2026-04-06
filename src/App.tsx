import { useEffect, useState } from "react"
import {
  getCurrentYearSession,
  getTeamChampionship,
  getDriverChampionship,
  getDrivers,
} from "@/api/OpenF1API"
import { default as DriversTable } from "@/components/driversChampionshipTable/DriversChampionshipTable"
import { MOCK_FANTASY_LEAGUE } from "./mocks/MockConstants"

type AppData = {
  session: Awaited<ReturnType<typeof getCurrentYearSession>>
  teamChamptionship: Awaited<ReturnType<typeof getTeamChampionship>>
  driversChamptionship: Awaited<ReturnType<typeof getDriverChampionship>>
  drivers: Awaited<ReturnType<typeof getDrivers>>
}

/** Single shared promise so Strict Mode / remounts do not re-fetch. */
let appDataPromise: Promise<AppData> | null = null

function loadAppData(): Promise<AppData> {
  if (!appDataPromise) {
    appDataPromise = (async () => {
      const session = await getCurrentYearSession("Shanghai", "Race")
      console.log("session", session)
      const teamChamptionship = await getTeamChampionship()
      console.log("teamChamptionship", teamChamptionship)
      const driversChamptionship = await getDriverChampionship()
      console.log("driversChamptionship", driversChamptionship)
      const drivers = await getDrivers()
      console.log("Drivers", drivers)
      return { session, teamChamptionship, driversChamptionship, drivers }
    })()
  }
  return appDataPromise
}

export function App() {
  const [appData, setAppData] = useState<AppData | undefined>()

  useEffect(() => {
    void loadAppData().then(setAppData)
  }, [])

  return (
    <div className="min-h-svh items-center p-6">
      <div className="flex min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="mx-auto w-full max-w-4xl">
          <DriversTable
            session={appData?.session ? [appData.session] : []}
            drivers={appData?.drivers ?? []}
            driverChampionship={appData?.driversChamptionship ?? []}
            fantasyLeague={MOCK_FANTASY_LEAGUE}
          />
        </div>
      </div>
    </div>
  )
}

export default App
