import { useEffect, useState } from "react"
import {
  getCurrentYearSession,
  getCurrentYearMeetings,
  getTeamChampionship,
  getDriverChampionship,
  getDrivers,
  getSessionResultsForSessions,
} from "@/api/OpenF1API"
import { default as DriversTable } from "@/components/driversChampionshipTable/DriversChampionshipTable"
import { MOCK_FANTASY_LEAGUE } from "./mocks/MockConstants"
import FullDriversChampionshipTable from "./components/fullDriversChampionshipTable.tsx/FullDriversChampionshipTable"
import type { ISession } from "./types/api.interfaces"
import type { SessionCircuitResults } from "./types/FantasyLeague.interfaces"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import TeamsChampionshipTable from "./components/teamsChampionshipTable/TeamsChampionshipTable"
import FullTeamsChampionshipTable from "./components/fullTeamsChampionshipTable/FullTeamsChampionshipTable"

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
  const [championshipTableLoading, setChampionshipTableLoading] = useState(true)
  const [sessionResultsLoading, setSessionResultsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const [
          raceSessions,
          sprintSessions,
          yearMeetings,
          teamChampionship,
          driversChamptionship,
          drivers,
        ] = await Promise.all([
          getCurrentYearSession("Race"),
          getCurrentYearSession("Sprint"),
          getCurrentYearMeetings(),
          getTeamChampionship(),
          getDriverChampionship(),
          getDrivers(),
        ])
        if (cancelled) return

        const merged = [...(raceSessions ?? []), ...(sprintSessions ?? [])]
        const sessions: ISession[] = [
          ...new Map(merged.map((s) => [s.session_key, s])).values(),
        ].sort((a, b) => {
          const ta = new Date(String(a.date_start)).getTime()
          const tb = new Date(String(b.date_start)).getTime()
          return tb - ta
        })

        setAppData({
          sessions,
          teamChampionship,
          driversChamptionship,
          drivers,
          sessionResults: [],
        })
        setFantasyTableLoading(false)
        setChampionshipTableLoading(false)

        const sessionResults: SessionCircuitResults[] =
          await getSessionResultsForSessions(
            sessions,
            undefined,
            yearMeetings ?? undefined
          )
        if (cancelled) return

        setAppData((prev) => (prev ? { ...prev, sessionResults } : undefined))
      } catch (e) {
        console.error("Failed to load app data", e)
      } finally {
        if (!cancelled) {
          setChampionshipTableLoading(false)
          setSessionResultsLoading(false)
          setFantasyTableLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-svh p-6">
      <div className="mx-auto w-full max-w-7xl min-w-0">
        <div className="flex flex-col gap-4 text-sm leading-loose">
          <Tabs defaultValue="drivers" className="w-full">
            <TabsList className="mx-auto">
              <TabsTrigger value="drivers">Drivers Championship</TabsTrigger>
              <TabsTrigger value="teams">Constructors Championship</TabsTrigger>
            </TabsList>
            <TabsContent value="drivers" className="mt-4 flex flex-col gap-4">
              <DriversTable
                Drivers={appData?.drivers ?? []}
                DriverChampionship={appData?.driversChamptionship ?? []}
                FantasyLeague={MOCK_FANTASY_LEAGUE}
                isLoading={fantasyTableLoading}
              />
              <FullDriversChampionshipTable
                SessionCircuitResults={appData?.sessionResults ?? []}
                Sessions={appData?.sessions ?? []}
                Drivers={appData?.drivers ?? []}
                DriverChampionship={appData?.driversChamptionship ?? []}
                isLoading={championshipTableLoading}
                isSessionResultsLoading={sessionResultsLoading}
              />
            </TabsContent>
            <TabsContent value="teams" className="mt-4 flex flex-col gap-4">
              <TeamsChampionshipTable
                FantasyLeague={MOCK_FANTASY_LEAGUE}
                TeamChampionship={appData?.teamChampionship ?? []}
                IsLoading={championshipTableLoading}
              />
              <FullTeamsChampionshipTable
                SessionCircuitResults={appData?.sessionResults ?? []}
                Sessions={appData?.sessions ?? []}
                Drivers={appData?.drivers ?? []}
                TeamChampionship={appData?.teamChampionship ?? []}
                isLoading={championshipTableLoading}
                isSessionResultsLoading={sessionResultsLoading}
              ></FullTeamsChampionshipTable>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default App
