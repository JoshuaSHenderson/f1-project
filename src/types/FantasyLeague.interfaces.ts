import type { ISessionResult } from "./api.interfaces"

interface IFantasyLeague {
    FantasyTeamPrincipal: string
    FantasyTeamName: string
    DriverNumbers: number[]
    Teams: string[]
}


type SessionCircuitResults = {
    circuit_key: number
    circuit_short_name: string
    sessionResults: ISessionResult[]
}

export type { IFantasyLeague, SessionCircuitResults }