import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Pawn } from './types';
import { gamePath, offsets } from './gamePath';
import { finishes, spawns } from './tileIDs';
import { GameService } from './game.service';
import { apiPrefix } from './apiPrefix';

@Injectable({
	providedIn: 'root'
})
export class BoardService {

	public pawnTiles$: Observable<Array<Pawn>>;
	private pawnTilesSubject = new Subject<Array<Pawn>>();

	public highlightTile$: Observable<number>;
	private highlightTileSubject = new Subject<number>();

	private pawns: Array<Pawn> = [
		{ color: "red", moved: -1, id: 0, highlited: false },
		{ color: "red", moved: -1, id: 1, highlited: false },
		{ color: "red", moved: -1, id: 2, highlited: false },
		{ color: "red", moved: -1, id: 3, highlited: false },
		{ color: "blue", moved: -1, id: 4, highlited: false },
		{ color: "blue", moved: -1, id: 5, highlited: false },
		{ color: "blue", moved: -1, id: 6, highlited: false },
		{ color: "blue", moved: -1, id: 7, highlited: false },
		{ color: "green", moved: -1, id: 8, highlited: false },
		{ color: "green", moved: -1, id: 9, highlited: false },
		{ color: "green", moved: -1, id: 10, highlited: false },
		{ color: "green", moved: -1, id: 11, highlited: false },
		{ color: "yellow", moved: -1, id: 12, highlited: false },
		{ color: "yellow", moved: -1, id: 13, highlited: false },
		{ color: "yellow", moved: -1, id: 14, highlited: false },
		{ color: "yellow", moved: -1, id: 15, highlited: false },
	];

	private rollResult: number = 0;
	private playerColor: string = "";
	private canMove: boolean = false;

	constructor(private gameService: GameService) {
		this.pawnTiles$ = this.pawnTilesSubject.asObservable();
		this.highlightTile$ = this.highlightTileSubject.asObservable();
		this.playerColor = gameService.playerColor;
		this.subscribeToGameService();
	}

	public async getRollResult(result: number) {
		this.rollResult = result;

		const pawnsToHighlight: Array<number> = await this.highlightOptions();

		if (pawnsToHighlight.length) {
			this.pawns.forEach((pawn: Pawn) => {
				if (pawnsToHighlight.includes(pawn.id)) {
					pawn.highlited = true;
				} else {
					pawn.highlited = false;
				}
			});

			this.gameService.updateMade("ROLL", this.pawns, result);
		} else {
			this.gameService.updateMade("MOVE", undefined, result);
		}
	}

	public getPawnsPositions() {
		return this.pawns;
	}

	public getCanMove() {
		return this.canMove;
	}

	private subscribeToGameService() {
		this.gameService.pawns$.subscribe((pawns) => {
			this.canMove = this.gameService.playerStatus == 4;

			this.pawns = pawns;
			this.pawnTilesSubject.next(this.pawns);
		});

		this.gameService.roll$.subscribe((roll) => {
			this.rollResult = roll;
		})
	}

	private async highlightOptions() {
		const pawnsToHighlightIds: Array<number> = [];
		for (const [index, pawn] of this.pawns.entries()) {
			if (pawn.color != this.playerColor) continue;
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

			const highlight = await this.makeMove(pawn.color, tile, true);
			if (highlight) {
				pawnsToHighlightIds.push(pawn.id);
			}
		}
		return pawnsToHighlightIds;
	}

	public movePawn(tileId: number, pawnColor: string) {
		if (pawnColor != this.playerColor || !this.canMove) return;
		this.makeMove(pawnColor, tileId, false);
	}

	private async makeMove(pawnColor: string, tileId: number, fake: boolean) {
		const body = JSON.stringify({
			playerColor: this.playerColor,
			pawns: this.pawns,
			pawnColor,
			tileId,
			rollResult: this.rollResult
		});
		const response: Response = await fetch(apiPrefix + "move.php", {
			method: "POST", body, headers: {
				"Content-Type": "application/json"
			}
		});
		const data = await response.json();

		if (fake) {
			return !(data.status == "NO");
		}
		if (data.status == "WIN") {
			this.gameService.updateMade("WIN");
		} else if (data.status == "MOVE") {
			this.gameService.updateMade("MOVE", data.pawns);
			this.pawns = data.pawns;
			this.pawnTilesSubject.next(this.pawns);
		}
		return true;
	}

	public highlightMoveOption(tileId: number, pawnColor: string) {
		let toMove: number = -1;
		if (gamePath.includes(tileId)) {
			let moved: number = gamePath.indexOf(tileId) - offsets[pawnColor];
			if (moved < 0) moved += gamePath.length;

			if (moved + this.rollResult >= gamePath.length + finishes[pawnColor].length) {
				toMove = gamePath.length + finishes[pawnColor].length - 1;
			} else {
				toMove = moved + this.rollResult;
			}
		} else {
			let spawn = false;
			for (const [_, spawnTiles] of Object.entries(spawns)) {
				if (spawnTiles.includes(tileId)) {
					spawn = true;
					break;
				}
			}
			if (spawn) {
				toMove = 0;
			} else {
				const finishIndex = finishes[pawnColor].indexOf(tileId);

				if (finishIndex + this.rollResult >= finishes[pawnColor].length) {
					toMove = gamePath.length + finishes[pawnColor].length - 1;
				} else {
					toMove = finishIndex + gamePath.length + this.rollResult;
				}
			}
		}
		let highlightTileId: number = 0;
		if (toMove >= gamePath.length) {
			highlightTileId = finishes[pawnColor][toMove - gamePath.length];
		} else {
			highlightTileId = gamePath[(toMove + offsets[pawnColor]) % gamePath.length];
		}
		this.highlightTileSubject.next(highlightTileId);
	}

	public hideMoveOption() {
		this.highlightTileSubject.next(-1);
	}
}
