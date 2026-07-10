import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BoardService } from '../board.service';

@Component({
    selector: 'app-tile',
    imports: [CommonModule],
    templateUrl: './tile.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './tile.component.css'
})
export class TileComponent {
	@Input() id = 0;
	@Input() visible = false;
	@Input() color = "";
	@Input() pawn = "none";
	@Input() highlighted = false;
	@Input() proposition = false;

	constructor(private boardService: BoardService) {

	}

	public move() {
		if (this.pawn != "none") {
			this.boardService.movePawn(this.id, this.pawn);
		}
	}

	public showMoveOption() {
		if (this.highlighted) {
			this.boardService.highlightMoveOption(this.id, this.pawn);
		}
	}

	public hideMoveOption() {
		if (this.highlighted) {
			this.boardService.hideMoveOption();
		}
	}
}
