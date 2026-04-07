import type { ISessionResult } from "./api.interfaces"

interface IFantasyLeague {
    FantasyTeamPrincipal: string
    FantasyTeamName: string
    DriverNumbers: number[]
    Teams: string[]
}

/** Per-session race/sprint result block: classification plus meeting/circuit metadata from OpenF1. */
type SessionCircuitResults = {
    circuit_key: number
    sessionResults: ISessionResult[]
    /** Track icon URL from the meetings API */
    circuit_image: string
    meeting_name: string
    location: string
    country_name: string
}

export type { IFantasyLeague, SessionCircuitResults }