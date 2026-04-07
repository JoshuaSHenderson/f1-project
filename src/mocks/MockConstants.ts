import type { IFantasyLeague } from "@/types/FantasyLeague.interfaces"

/** Four fantasy teams (columns). Row 1 = principals; rows 2–6 = drivers; rows 7–8 = constructors. */
const MOCK_FANTASY_LEAGUE: IFantasyLeague[] = [
    {
        FantasyTeamPrincipal: "Rachel",
        FantasyTeamName: "IF IF IF",
        DriverNumbers: [3, 6, 81, 27, 77],
        Teams: ["Red Bull Racing", "Haas F1 Team"],
    },
    {
        FantasyTeamPrincipal: "DJ",
        FantasyTeamName: "It's NEAR a fish!",
        DriverNumbers: [1, 12, 23, 11, 41],
        Teams: ["Mercedes", "Racing Bulls"],
    },
    {
        FantasyTeamPrincipal: "Josh",
        FantasyTeamName: "If you talk to me every lap I will disconnect the radio.",
        DriverNumbers: [16, 44, 14, 5, 10],
        Teams: ["Ferrari", "Alpine"],
    },
    {
        FantasyTeamPrincipal: "Sabrina",
        FantasyTeamName: "Do P3, yeah!",
        DriverNumbers: [63, 55, 87, 31, 30],
        Teams: ["McLaren", "Williams"],
    },
]

export { MOCK_FANTASY_LEAGUE }
