export const tiles: Array<number> = [0, 1, 4, 5, 6, 9, 10, 11, 12, 15, 16, 17, 20, 21, 26, 27, 28, 37, 38, 39, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 81, 82, 83, 92, 93, 94, 99, 100, 103, 104, 105, 108, 109, 110, 111, 114, 115, 116, 119, 120];

export const finishes: { [key: string]: Array<number> } = {
	red: [56, 57, 58, 59],
	blue: [16, 27, 38, 49],
	green: [64, 63, 62, 61],
	yellow: [104, 93, 82, 71],
}

export const spawns: { [key: string]: Array<number> } = {
	red: [0, 1, 11, 12],
	blue: [9, 10, 20, 21],
	green: [108, 109, 119, 120],
	yellow: [99, 100, 110, 111],
}

export const starts: { [ley: string]: number } = {
	red: 44,
	blue: 6,
	green: 76,
	yellow: 114,
}
