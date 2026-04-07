import type { ITeamChampionship } from "@/types/api.interfaces";
import type { IFantasyLeague } from "@/types/FantasyLeague.interfaces";

export function getTeamsChampionshipTableContent(
    fantasyLeague: IFantasyLeague[],
    teamChampionship: ITeamChampionship[],
): ITeamChampionshipRows[] {

    const driversChamptionshipRows: ITeamChampionshipRows[] = []
    fantasyLeague.forEach(fantasyTeam => {

        const fantasyTeamTeams: ITeamChampionship[] = getTeams(fantasyTeam, teamChampionship)

        driversChamptionshipRows.push({
            FantasyTeamName: fantasyTeam.FantasyTeamName,
            FantasyTeamPrincipal: fantasyTeam.FantasyTeamPrincipal,
            Teams: fantasyTeamTeams,
            TotalPoints: getTeamChampionshipTotalPoints(fantasyTeamTeams)
        })
    });

    return driversChamptionshipRows
}

function getTeams(fantasyTeam: IFantasyLeague, teamChampionship: ITeamChampionship[]): ITeamChampionship[] {
    const fantasyTeams: ITeamChampionship[] = []
    fantasyTeam.Teams.forEach(team => {

        const foundTeam = teamChampionship.find((t) => t.team_name == team)

        if (!foundTeam) {
            return
        }

        fantasyTeams.push(foundTeam)
    });

    return fantasyTeams
}

interface ITeamChampionshipRows {
    FantasyTeamName: string
    FantasyTeamPrincipal: string
    Teams: ITeamChampionship[]
    TotalPoints: number
}

function getTeamChampionshipTotalPoints(
    teamChampionship: ITeamChampionship[]
): number {
    let totalPoints = 0
    teamChampionship.forEach(team => {
        totalPoints += team.points_current
    });

    return totalPoints

};