import { Badge } from "./badge"

interface TeamBadgeProps {
  team_colour: string | undefined
  team_name: string | undefined
}

export default function TeamBadge({ team_colour, team_name }: TeamBadgeProps) {
  return (
    <Badge
      className="h-10 px-2.5 py-1 text-sm"
      style={team_colour ? { backgroundColor: `#${team_colour}` } : undefined}
    >
      {team_name ?? "—"}
    </Badge>
  )
}
