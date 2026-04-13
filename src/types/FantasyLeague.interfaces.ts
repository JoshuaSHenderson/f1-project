import type { SessionResult } from "./api.interfaces"

interface FantasyLeague {
  fantasyTeamPrincipal: string
  fantasyTeamName: string
  driverNumbers: number[]
  teams: string[]
}

/** Per-session race/sprint result block: classification plus meeting/circuit metadata from OpenF1. */
type SessionCircuitResults = {
  circuit_key: number
  sessionResults: SessionResult[]
  circuit_image: string
  meeting_name: string
  location: string
  country_name: string
}

export type { FantasyLeague, SessionCircuitResults }
