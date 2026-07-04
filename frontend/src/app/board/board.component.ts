import { Component } from '@angular/core';
import { TileComponent } from '../tile/tile.component';
import { CommonModule } from '@angular/common';
import { finishes, spawns, starts, tiles } from '../tileIDs';
import { BoardService } from '../board.service';
import { gamePath, offsets } from '../gamePath';
import { Pawn, Tile } from '../types';

@Component({
	selector: 'app-board',
	standalone: true,
	imports: [TileComponent, CommonModule],
	templateUrl: './board.component.html',
	styleUrl: './board.component.css'
})

export class BoardComponent {
	public tempList: Array<Tile> = [];
	private pawns: Array<Pawn> = [];

	constructor(private boardService: BoardService) {
		this.pawns = this.boardService.getPawnsPositions();

		this.generateBoard();
		this.placePawns();
		this.subscribeToBoardService();
	}

	private generateBoard() {
		this.tempList.length = 0;
		for (let i = 0; i < 121; i++) {
			let color = "";

			for (const [spawnColor, spawnTiles] of Object.entries(spawns)) {
				if (spawnTiles.includes(i)) {
					color = spawnColor;
					break;
				}
			}

			for (const [finishColor, finishTiles] of Object.entries(finishes)) {
				if (color != "") break;
				if (finishTiles.includes(i)) {
					switch (finishColor) {
						case "red":
							color = "pink";
							break;
						case "blue":
						case "green":
						case "yellow":
							color = "light" + finishColor;
							break;
						default:
							break;
					}
					break;
				}
			}

			for (const [startColor, startTile] of Object.entries(starts)) {
				if (color != "") break;
				if (startTile == i) {
					color = startColor;
					break;
				}
			}

			this.tempList.push({
				id: i,
				color,
				visible: tiles.includes(i),
				pawn: "none",
				highlighted: false,
				proposition: false
			});
		}
	}

	private placePawns() {
		this.pawns.forEach((pawn: Pawn, index: number) => {
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
			this.tempList[tile].pawn = pawn.color;
			this.tempList[tile].highlighted = pawn.highlited;
		});
	}

	private highlightTile(tile: number) {
		this.tempList[tile].proposition = true;
	}

	private hideHighlightedTile() {
		this.tempList.forEach((tile: Tile) => {
			tile.proposition = false;
		});
	}

	private subscribeToBoardService() {
		this.boardService.pawnTiles$.subscribe((pawns: Array<Pawn>) => {
			if (this.boardService.getCanMove()) {
				this.pawns = pawns;
			} else {
				this.pawns = pawns.map((pawn: Pawn) => { pawn.highlited = false; return pawn })
			}

			this.generateBoard();
			this.placePawns();
		});

		this.boardService.highlightTile$.subscribe((tileId: number) => {
			if (tileId > 0) {
				this.highlightTile(tileId);
			} else {
				this.hideHighlightedTile();
			}
		});
	}
}
