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

	private pawns: Array<Pawn> = [];

	private rollResult: number = 0;
	private playerColor: string = "";
	private canMove: boolean = false;

	constructor(private gameService: GameService) {
		this.pawnTiles$ = this.pawnTilesSubject.asObservable();
		this.playerColor = gameService.playerColor;
		this.subscribeToGameService();
	}

	public getRollResult(result: number) {
		this.rollResult = result;

		const pawnsToHighlight: Array<Pawn> = this.highlightOptions();
		if (pawnsToHighlight.length) {
			this.gameService.updateMade("ROLL", undefined, result);
		} else {
			this.gameService.updateMade("MOVE", undefined, result);
		}
	}

	public getPawnsPositions() {
		return this.pawns;
	}

	private subscribeToGameService() {
		this.gameService.pawns$.subscribe((pawns) => {
			this.canMove = this.gameService.playerStatus == 4;

			this.pawns = pawns;
			this.pawnTilesSubject.next(this.pawns);
		});
	}

	private highlightOptions() {
		const pawnsToHighlight = this.pawns.filter((pawn: Pawn, index: number) => {
			if (pawn.color != this.playerColor) return false;
			type ObjectKey = keyof typeof offsets;
			const color: ObjectKey = pawn.color as ObjectKey;
			let tile: number = 0;
			if (pawn.moved >= gamePath.length) {
				tile = finishes[color][pawn.moved - gamePath.length];
			} else if (pawn.moved < 0) {
				tile = spawns[color][index % 4];
			} else {
				tile = gamePath[(pawn.moved + offsets[color]) % gamePath.length];
			}
			return this.movePawn(tile, pawn.color, true);
		});
		return pawnsToHighlight;
	}

	public movePawn(tileId: number, pawnColor: string, fake: boolean) {
		if (pawnColor != this.playerColor || (!this.canMove && !fake)) return false;

		const tempPawns: Array<Pawn> = JSON.parse(JSON.stringify(this.pawns)); //deep copy of literal-structures array

		if (gamePath.includes(tileId)) {
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

				if (this.rollResult != 6 && this.rollResult != 1) {
					return false;
				}


				const spawnIndex: number = spawns[pawnColor].indexOf(tileId);

				for (let i = 0; i < tempPawns.length; i++) {
					const pawn: Pawn = tempPawns[i];
					if (pawn.moved == -1 && pawn.color == pawnColor && i % 4 == spawnIndex) {
						pawn.moved = 0;
						break;
					}
				}
			} else {
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

		return this.checkForCollision(pawnColor, tempPawns, fake);
	}

	private checkForCollision(currentPawnColor: string, tempPawns: Array<Pawn>, fake: boolean) {
		const tiles: Array<{ color: string, id: number }> = [];
		let collisionTileId: number = -1;

		for (let i = 0; i < tempPawns.length; i++) {
			const pawn = tempPawns[i];
			type ObjectKey = keyof typeof offsets;
			const color: ObjectKey = pawn.color as ObjectKey;
			let tileId: number = 0;
			if (pawn.moved >= gamePath.length) {
				tileId = finishes[color][pawn.moved - gamePath.length];
			} else if (pawn.moved < 0) {
				tileId = spawns[color][i % 4];
			} else {
				tileId = gamePath[(pawn.moved + offsets[color]) % gamePath.length];
			}
			for (let i = 0; i < tiles.length; i++) {
				const tile = tiles[i];
				if (tile.id == tileId && tile.color != color) {
					collisionTileId = tileId;
					break;
				}
			}
			tiles.push({ color: color.toString(), id: tileId });

		};

		if (collisionTileId != -1) {
			for (const [_, finishTiles] of Object.entries(finishes)) {
				if (finishTiles.includes(collisionTileId)) return false;
			}

			for (let i = 0; i < tempPawns.length; i++) {
				const pawn = tempPawns[i];
				type ObjectKey = keyof typeof offsets;
				const color: ObjectKey = pawn.color as ObjectKey;
				let tileId: number = 0;
				if (pawn.moved >= gamePath.length) {
					tileId = finishes[color][pawn.moved - gamePath.length];
				} else if (pawn.moved < 0) {
					tileId = spawns[color][i % 4];
				} else {
					tileId = gamePath[(pawn.moved + offsets[color]) % gamePath.length];
				}
				if (tileId == collisionTileId && pawn.color != currentPawnColor) {
					pawn.moved = -1;
				}
			};
		}

		if (fake) {
			return true;
		} else {
			this.pawns = JSON.parse(JSON.stringify(tempPawns)); //deep copy of literal-structures array
			this.gameService.updateMade("MOVE", this.pawns);
			this.pawnTilesSubject.next(this.pawns);
			return true;
		}
	}
}
