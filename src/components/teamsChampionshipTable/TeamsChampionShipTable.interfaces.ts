import type { ITeamChampionship } from "@/types/api.interfaces"

interface ITeamChampionshipRows {
    FantasyTeamName: string
    FantasyTeamPrincipal: string
    Teams: ITeamChampionship[]
    TotalPoints: number
}

export type { ITeamChampionshipRows }
