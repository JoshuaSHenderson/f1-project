import type { FantasyLeague } from "@/types/FantasyLeague.interfaces"

/** Four fantasy teams (columns). Row 1 = principals; rows 2–6 = drivers; rows 7–8 = constructors. */
const MOCK_FANTASY_LEAGUE: FantasyLeague[] = [
  {
    fantasyTeamPrincipal: "Rachel",
    fantasyTeamName: "IF IF IF",
    driverNumbers: [3, 6, 81, 27, 77],
    teams: ["Red Bull Racing", "Haas F1 Team"],
  },
  {
    fantasyTeamPrincipal: "DJ",
    fantasyTeamName: "It's NEAR a fish!",
    driverNumbers: [1, 12, 23, 11, 41],
    teams: ["Mercedes", "Racing Bulls"],
  },
  {
    fantasyTeamPrincipal: "Josh",
    fantasyTeamName: "If you talk to me every lap I will disconnect the radio.",
    driverNumbers: [16, 44, 14, 5, 10],
    teams: ["Ferrari", "Alpine"],
  },
  {
    fantasyTeamPrincipal: "Sabrina",
    fantasyTeamName: "Do P3, yeah!",
    driverNumbers: [63, 55, 87, 31, 30],
    teams: ["McLaren", "Williams"],
  },
]

export { MOCK_FANTASY_LEAGUE }
