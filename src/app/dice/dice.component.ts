import { Component } from '@angular/core';
import { BoardService } from '../board.service';

@Component({
	selector: 'app-dice',
	standalone: true,
	imports: [],
	templateUrl: './dice.component.html',
	styleUrl: './dice.component.css'
})
export class DiceComponent {
	public result: number = 0;

	public constructor(private boardService: BoardService) {

	}

	roll() {
		this.result = Math.floor(Math.random() * (6) + 1);
		this.boardService.getRollResult(this.result);
	}
}
