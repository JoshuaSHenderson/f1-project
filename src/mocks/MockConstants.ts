import type { IFantasyLeague } from "@/types/FantasyLeague.interfaces"

/** Four fantasy teams (columns). Row 1 = principals; rows 2–6 = drivers; rows 7–8 = constructors. */
const MOCK_FANTASY_LEAGUE: IFantasyLeague[] = [
    {
        FantasyTeamPrincipal: "Rachel",
        FantasyTeamName: "IF IF IF",
        DriverNumbers: [33, 6, 81, 27, 77],
        Teams: ["Red Bull", "Haas"],
    },
    {
        FantasyTeamPrincipal: "DJ",
        FantasyTeamName: "It's NEAR a fish!",
        DriverNumbers: [1, 12, 23, 11, 41],
        Teams: ["Mercedes", "VCARB"],
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
        Teams: ["Mclaren", "Williams"],
    },
]

export { MOCK_FANTASY_LEAGUE }
