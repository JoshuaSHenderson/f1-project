
export function getHighest(numbers: number[]): number {
    let highestValue = 0;
    numbers.forEach(n => {
        if (n > highestValue) {
            highestValue = n
        }
    });
    return highestValue
}

export function getPostionsValueAndClass(position_start: number, position_current: number): {
    label: string;
    className: string;
} {
    return formatPositionsGainedOrLost(position_start - position_current)
}


export function formatPositionsGainedOrLost(change: number): {
    label: string
    className: string
} {
    if (!Number.isFinite(change) || change === 0) {
        return {
            label: "—",
            className: "border-border bg-muted/80 text-muted-foreground font-normal",
        }
    }
    if (change > 0) {
        return {
            label: `+${change}`,
            className:
                "border-emerald-500/40 bg-emerald-500/15 text-emerald-900 dark:border-emerald-400/35 dark:bg-emerald-500/20 dark:text-emerald-50",
        }
    }
    return {
        label: String(change),
        className:
            "border-red-500/40 bg-red-500/15 text-red-900 dark:border-red-400/35 dark:bg-red-500/20 dark:text-red-50",
    }
}
