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
import FullDriversChampionshipTable from "@/components/fullDriversChampionshipTable/FullDriversChampionshipTable"
import type { Session } from "./types/api.interfaces"
import type { SessionCircuitResults } from "./types/FantasyLeague.interfaces"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import TeamsChampionshipTable from "./components/teamsChampionshipTable/TeamsChampionshipTable"
import FullTeamsChampionshipTable from "./components/fullTeamsChampionshipTable/FullTeamsChampionshipTable"
import RaceResults from "./components/raceResults/RaceResults"

type AppData = {
  /** Race and Sprint sessions for the current year (deduped by `session_key`). */
  sessions: Session[]
  teamChampionship: Awaited<ReturnType<typeof getTeamChampionship>>
  driverChampionship: Awaited<ReturnType<typeof getDriverChampionship>>
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
          driverChampionship,
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
        const sessions: Session[] = [
          ...new Map(merged.map((s) => [s.session_key, s])).values(),
        ].sort((a, b) => {
          const ta = new Date(String(a.date_start)).getTime()
          const tb = new Date(String(b.date_start)).getTime()
          return tb - ta
        })

        setAppData({
          sessions,
          teamChampionship,
          driverChampionship,
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
              <TabsTrigger value="raceResults">Race Results</TabsTrigger>
            </TabsList>
            <TabsContent value="drivers" className="mt-4 flex flex-col gap-4">
              <DriversTable
                drivers={appData?.drivers ?? []}
                driverChampionship={appData?.driverChampionship ?? []}
                fantasyLeague={MOCK_FANTASY_LEAGUE}
                isLoading={fantasyTableLoading}
              />
              <FullDriversChampionshipTable
                sessionCircuitResults={appData?.sessionResults ?? []}
                sessions={appData?.sessions ?? []}
                drivers={appData?.drivers ?? []}
                driverChampionship={appData?.driverChampionship ?? []}
                isLoading={championshipTableLoading}
                isSessionResultsLoading={sessionResultsLoading}
              />
            </TabsContent>
            <TabsContent value="teams" className="mt-4 flex flex-col gap-4">
              <TeamsChampionshipTable
                fantasyLeague={MOCK_FANTASY_LEAGUE}
                teamChampionship={appData?.teamChampionship ?? []}
                isLoading={championshipTableLoading}
              />
              <FullTeamsChampionshipTable
                sessionCircuitResults={appData?.sessionResults ?? []}
                sessions={appData?.sessions ?? []}
                drivers={appData?.drivers ?? []}
                teamChampionship={appData?.teamChampionship ?? []}
                isLoading={championshipTableLoading}
                isSessionResultsLoading={sessionResultsLoading}
              />
            </TabsContent>
            <TabsContent
              value="raceResults"
              className="mt-4 flex flex-col gap-4"
            >
              <RaceResults
                sessionResults={appData?.sessionResults ?? []}
                sessions={appData?.sessions ?? []}
                drivers={appData?.drivers ?? []}
                isLoading={sessionResultsLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default App
