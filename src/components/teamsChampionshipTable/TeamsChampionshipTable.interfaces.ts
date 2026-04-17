import type { TeamChampionship } from "@/types/api.interfaces"

interface TeamChampionshipRows {
  fantasyTeamName: string
  fantasyTeamPrincipal: string
  teams: TeamChampionship[]
  totalPoints: number
}

export type { TeamChampionshipRows } 
