import { useEffect, useState } from "react"
import {
  getCurrentYearSession,
  getTeamChampionship,
  getDriverChampionship,
  getDrivers,
  getSessionResults,
} from "@/api/OpenF1API"
import { default as DriversTable } from "@/components/driversChampionshipTable/DriversChampionshipTable"
import { MOCK_FANTASY_LEAGUE } from "./mocks/MockConstants"
import FullDriversChampionshipTable from "./components/fullDriversChampionshipTable.tsx/FullDriversChampionshipTable"
import type { ISession } from "./types/api.interfaces"
import type { SessionCircuitResults } from "./types/FantasyLeague.interfaces"

type AppData = {
  /** Race and Sprint sessions for the current year (deduped by `session_key`). */
  sessions: ISession[]
  teamChampionship: Awaited<ReturnType<typeof getTeamChampionship>>
  driversChamptionship: Awaited<ReturnType<typeof getDriverChampionship>>
  drivers: Awaited<ReturnType<typeof getDrivers>>
  sessionResults: SessionCircuitResults[]
}

export function App() {
  const [appData, setAppData] = useState<AppData | undefined>()
  const [fantasyTableLoading, setFantasyTableLoading] = useState(true)
  const [fullDriversTableLoading, setFullDriversTableLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const [
          raceSessions,
          sprintSessions,
          teamChampionship,
          driversChamptionship,
          drivers,
        ] = await Promise.all([
          getCurrentYearSession("Race"),
          getCurrentYearSession("Sprint"),
          getTeamChampionship(),
          getDriverChampionship(),
          getDrivers(),
        ])
        if (cancelled) return

        const merged = [...(raceSessions ?? []), ...(sprintSessions ?? [])]
        const sessions: ISession[] = [
          ...new Map(merged.map((s) => [s.session_key, s])).values(),
        ]

        setAppData({
          sessions,
          teamChampionship,
          driversChamptionship,
          drivers,
          sessionResults: [],
        })
        setFantasyTableLoading(false)

        const allSessionResults = (
          await Promise.all(
            sessions.map(async (s) => {
              const results = await getSessionResults(s.session_key)
              if (results == null || results.length === 0) return null
              return {
                circuit_key: s.circuit_key,
                circuit_short_name: s.circuit_short_name,
                sessionResults: results,
              }
            })
          )
        ).filter((b): b is SessionCircuitResults => b != null)
        const sessionResults = allSessionResults.flatMap((b) => b)
        if (cancelled) return

        setAppData((prev) => (prev ? { ...prev, sessionResults } : undefined))
      } catch (e) {
        console.error("Failed to load app data", e)
      } finally {
        if (!cancelled) {
          setFullDriversTableLoading(false)
          setFantasyTableLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-svh items-center p-6">
      <div className="flex min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="mx-auto w-full max-w-7xl">
          <DriversTable
            Drivers={appData?.drivers ?? []}
            DriverChampionship={appData?.driversChamptionship ?? []}
            FantasyLeague={MOCK_FANTASY_LEAGUE}
            isLoading={fantasyTableLoading}
          />
        </div>
        <div className="mx-auto w-full max-w-7xl">
          <FullDriversChampionshipTable
            SessionCircuitResults={appData?.sessionResults ?? []}
            Sessions={appData?.sessions ?? []}
            Drivers={appData?.drivers ?? []}
            DriverChampionship={appData?.driversChamptionship ?? []}
            isLoading={fullDriversTableLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default App
