export type Tile = {
	id: number,
	color: string,
	visible: boolean,
	pawn: string,
	highlighted: boolean,
	proposition: boolean
}

export type Pawn = {
	moved: number,
	color: string,
	id: number,
	highlited: boolean
}

export type Player = {
	nick: string,
	status: number,
	color: string
}

export type GameData = {
	status: number,
	nick: string,
	color: string,
	uid: string,
	pawns: Array<Pawn>,
	players: Array<Player>
}

export type Game = {
	uid: string,
	status: number,
	pawns: Array<Pawn>,
	players: Array<Player>,
	roll: number,
	winner: string,
	timestamp: number
}

export type UpdateType = "STATUS" | "MOVE" | "ROLL" | "WIN";
