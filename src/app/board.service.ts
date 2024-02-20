import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Pawn } from './types';
import { gamePath, offsets } from './gamePath';
import { finishes, spawns } from './tileIDs';

@Injectable({
	providedIn: 'root'
})
export class BoardService {

	public getRollResult$: Observable<number>;
	private getRollResultSubject = new Subject<number>();

	public pawnTiles$: Observable<Array<Pawn>>;
	private pawnTilesSubject = new Subject<Array<Pawn>>();

	private pawns: Array<Pawn> = [
		{ moved: -1, color: "red" },
		{ moved: -1, color: "red" },
		{ moved: -1, color: "red" },
		{ moved: -1, color: "red" },
		{ moved: -1, color: "blue" },
		{ moved: 5, color: "blue" },
		{ moved: -1, color: "blue" },
		{ moved: -1, color: "blue" },
		{ moved: -1, color: "green" },
		{ moved: 32, color: "green" },
		{ moved: -1, color: "green" },
		{ moved: -1, color: "green" },
		{ moved: 33, color: "yellow" },
		{ moved: -1, color: "yellow" },
		{ moved: -1, color: "yellow" },
		{ moved: -1, color: "yellow" },
	];

	private rollResult: number = 0;

	constructor() {
		this.getRollResult$ = this.getRollResultSubject.asObservable();
		this.pawnTiles$ = this.pawnTilesSubject.asObservable();
	}

	public getRollResult(result: number) {
		this.rollResult = result;
		this.getRollResultSubject.next(result);
	}

	public getPawnsPositions() {
		return this.pawns;
	}

	public movePawn(tileId: number, pawnColor: string) {
		if (gamePath.includes(tileId)) {
			console.log("gamepath");
			let moved: number = gamePath.indexOf(tileId) - offsets[pawnColor];
			if (moved < 0) moved += gamePath.length;

			let alreadyMoved = false;
			this.pawns.forEach(pawn => {
				if (pawn.moved == moved && pawn.color == pawnColor && !alreadyMoved) {
					pawn.moved += this.rollResult;
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
				const spawnIndex: number = spawns[pawnColor].indexOf(tileId);

				for (let i = 0; i < this.pawns.length; i++) {
					const pawn: Pawn = this.pawns[i];
					if (pawn.moved == -1 && pawn.color == pawnColor && i % 4 == spawnIndex) {
						pawn.moved = 0;
						break;
					}
				}
			} else {
				console.log("finish");
				const finishIndex = finishes[pawnColor].indexOf(tileId);

				this.pawns.forEach(pawn => {
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

		this.checkForCollision(pawnColor);
	}

	private checkForCollision(currentPawnColor: string) {
		const tiles: Array<number> = [];
		let collisionTile: number = -1;
		for (let i = 0; i < this.pawns.length; i++) {
			const pawn = this.pawns[i];
			type ObjectKey = keyof typeof offsets;
			const color: ObjectKey = pawn.color as ObjectKey;
			let tile: number = 0;
			if (pawn.moved > 39) {
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
			for (let i = 0; i < this.pawns.length; i++) {
				const pawn = this.pawns[i];
				type ObjectKey = keyof typeof offsets;
				const color: ObjectKey = pawn.color as ObjectKey;
				let tile: number = 0;
				if (pawn.moved > 39) {
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

		this.pawnTilesSubject.next(this.pawns);
	}
}
