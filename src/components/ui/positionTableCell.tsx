import { cn } from "@/lib/utils"
import { Badge } from "./badge"

interface PositionTableCellProps {
  index: number
  placesChange: {
    label: string
    className: string
  }
}

export default function PositionTableCell(props: PositionTableCellProps) {
  return (
    <div className="flex items-center gap-2">
      {props.index + 1}
      <Badge
        variant="outline"
        className={cn(
          "h-7 min-w-9 justify-center border px-2.5 text-xs font-medium tabular-nums",
          props.placesChange.className
        )}
      >
        {props.placesChange.label}
      </Badge>
    </div>
  )
}
