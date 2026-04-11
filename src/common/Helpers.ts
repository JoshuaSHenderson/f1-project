
export function getHighest(numbers: number[]): number {
    let highestValue = 0;
    numbers.forEach(n => {
        if (n > highestValue) {
            highestValue = n
        }
    });
    return highestValue
}