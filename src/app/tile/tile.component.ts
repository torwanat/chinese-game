import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BoardService } from '../board.service';

@Component({
	selector: 'app-tile',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tile.component.html',
	styleUrl: './tile.component.css'
})
export class TileComponent {
	@Input() id = 0;
	@Input() visible = false;
	@Input() color = "";
	@Input() pawn = "none";
	@Input() highlighted = false;

	constructor(private boardService: BoardService) {

	}

	public move() {
		if (this.pawn != "none") {
			this.boardService.movePawn(this.id, this.pawn, false);
		}
	}
}
