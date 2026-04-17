import type { TeamChampionship } from "@/types/api.interfaces"
import type { FantasyLeague } from "@/types/FantasyLeague.interfaces"
import type { TeamChampionshipRows } from "./TeamsChampionshipTable.interfaces"

export function getTeamsChampionshipTableContent(
  fantasyLeague: FantasyLeague[],
  teamChampionship: TeamChampionship[]
): TeamChampionshipRows[] {
  const teamChampionshipRows: TeamChampionshipRows[] = []
  fantasyLeague.forEach((fantasyTeam) => {
    const fantasyTeamTeams: TeamChampionship[] = getTeams(
      fantasyTeam,
      teamChampionship
    )

    teamChampionshipRows.push({
      fantasyTeamName: fantasyTeam.fantasyTeamName,
      fantasyTeamPrincipal: fantasyTeam.fantasyTeamPrincipal,
      teams: fantasyTeamTeams,
      totalPoints: getTeamChampionshipTotalPoints(fantasyTeamTeams),
    })
  })

  return teamChampionshipRows
}

function getTeams(
  fantasyTeam: FantasyLeague,
  teamChampionship: TeamChampionship[]
): TeamChampionship[] {
  const fantasyTeams: TeamChampionship[] = []
  fantasyTeam.teams.forEach((team) => {
    const foundTeam = teamChampionship.find((t) => t.team_name == team)

    if (!foundTeam) {
      return
    }

    fantasyTeams.push(foundTeam)
  })

  return fantasyTeams
}

function getTeamChampionshipTotalPoints(
  teamChampionship: TeamChampionship[]
): number {
  let totalPoints = 0
  teamChampionship.forEach((team) => {
    totalPoints += team.points_current
  })

  return totalPoints
}
