import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Pawn } from './types';
import { gamePath, offsets } from './gamePath';
import { finishes, spawns } from './tileIDs';
import { GameService } from './game.service';

@Injectable({
	providedIn: 'root'
})
export class BoardService {

	public pawnTiles$: Observable<Array<Pawn>>;
	private pawnTilesSubject = new Subject<Array<Pawn>>();

	private pawns: Array<Pawn> = [
		{ moved: -1, color: "red", id: 1 },
		{ moved: -1, color: "red", id: 2 },
		{ moved: -1, color: "red", id: 3 },
		{ moved: -1, color: "red", id: 4 },
		{ moved: -1, color: "blue", id: 5 },
		{ moved: -1, color: "blue", id: 6 },
		{ moved: -1, color: "blue", id: 7 },
		{ moved: -1, color: "blue", id: 8 },
		{ moved: -1, color: "green", id: 9 },
		{ moved: -1, color: "green", id: 10 },
		{ moved: -1, color: "green", id: 11 },
		{ moved: -1, color: "green", id: 12 },
		{ moved: -1, color: "yellow", id: 13 },
		{ moved: -1, color: "yellow", id: 14 },
		{ moved: -1, color: "yellow", id: 15 },
		{ moved: -1, color: "yellow", id: 16 },
	];

	private rollResult: number = 0;
	private playerColor: string = "";

	constructor(private gameService: GameService) {
		this.pawnTiles$ = this.pawnTilesSubject.asObservable();
		this.playerColor = gameService.playerColor;
		this.subscribeToGameService();
	}

	public getRollResult(result: number) {
		this.rollResult = result;
		this.gameService.updateMade("ROLL", undefined, result);
	}

	public getPawnsPositions() {
		return this.pawns;
	}

	private subscribeToGameService() {
		this.gameService.pawns$.subscribe((pawns) => {
			this.pawns = pawns;
			this.pawnTilesSubject.next(this.pawns);
		});
	}

	public movePawn(tileId: number, pawnColor: string) {
		if (pawnColor != this.playerColor) return;

		const tempPawns: Array<Pawn> = JSON.parse(JSON.stringify(this.pawns)); //deep copy of literal-structures array

		if (gamePath.includes(tileId)) {
			console.log("gamepath");
			let moved: number = gamePath.indexOf(tileId) - offsets[pawnColor];
			if (moved < 0) moved += gamePath.length;

			let alreadyMoved = false;
			tempPawns.forEach(pawn => {
				if (pawn.moved == moved && pawn.color == pawnColor && !alreadyMoved) {
					if (moved + this.rollResult >= gamePath.length + finishes[pawn.color].length) {
						pawn.moved = gamePath.length + finishes[pawnColor].length - 1;
					} else {
						pawn.moved += this.rollResult;
					}
					alreadyMoved = true;
				}
			});
		} else {
			let spawn = false;
			for (const [_, spawnTiles] of Object.entries(spawns)) {
				if (spawnTiles.includes(tileId)) {
					spawn = true;
					break;
				}
			}
			if (spawn) {
				console.log("spawn");

				if (this.rollResult != 6 && this.rollResult != 1) {
					return;
				}

				console.log("go");

				const spawnIndex: number = spawns[pawnColor].indexOf(tileId);

				for (let i = 0; i < tempPawns.length; i++) {
					const pawn: Pawn = tempPawns[i];
					if (pawn.moved == -1 && pawn.color == pawnColor && i % 4 == spawnIndex) {
						pawn.moved = 0;
						break;
					}
				}
			} else {
				console.log("finish");
				const finishIndex = finishes[pawnColor].indexOf(tileId);

				tempPawns.forEach(pawn => {
					if (pawn.moved - gamePath.length == finishIndex && pawn.color == pawnColor) {
						if (finishIndex + this.rollResult >= finishes[pawnColor].length) {
							pawn.moved = gamePath.length + finishes[pawnColor].length - 1;
						} else {
							pawn.moved += this.rollResult;
						}
					}
				});
			}
		}

		this.checkForCollision(pawnColor, tempPawns);
	}

	private checkForCollision(currentPawnColor: string, tempPawns: Array<Pawn>) {
		const tiles: Array<number> = [];
		let collisionTile: number = -1;

		for (let i = 0; i < tempPawns.length; i++) {
			const pawn = tempPawns[i];
			type ObjectKey = keyof typeof offsets;
			const color: ObjectKey = pawn.color as ObjectKey;
			let tile: number = 0;
			if (pawn.moved >= gamePath.length) {
				tile = finishes[color][pawn.moved - gamePath.length];
			} else if (pawn.moved < 0) {
				tile = spawns[color][i % 4];
			} else {
				tile = gamePath[(pawn.moved + offsets[color]) % gamePath.length];
			}
			if (tiles.includes(tile)) {
				collisionTile = tile;
				break;
			} else {
				tiles.push(tile);
			}
		};

		if (collisionTile != -1) {
			for (const [_, finishTiles] of Object.entries(finishes)) {
				if (finishTiles.includes(collisionTile)) return;
			}

			for (let i = 0; i < tempPawns.length; i++) {
				const pawn = tempPawns[i];
				type ObjectKey = keyof typeof offsets;
				const color: ObjectKey = pawn.color as ObjectKey;
				let tile: number = 0;
				if (pawn.moved >= gamePath.length) {
					tile = finishes[color][pawn.moved - gamePath.length];
				} else if (pawn.moved < 0) {
					tile = spawns[color][i % 4];
				} else {
					tile = gamePath[(pawn.moved + offsets[color]) % gamePath.length];
				}
				if (tile == collisionTile && pawn.color != currentPawnColor) {
					pawn.moved = -1;
				}
			};
		}

		this.pawns = JSON.parse(JSON.stringify(tempPawns)); //deep copy of literal-structures array
		this.gameService.updateMade("MOVE", this.pawns);
		this.pawnTilesSubject.next(this.pawns);
	}
}
