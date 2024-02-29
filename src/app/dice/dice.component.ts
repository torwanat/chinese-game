import { Component } from '@angular/core';
import { BoardService } from '../board.service';
import { GameService } from '../game.service';

@Component({
	selector: 'app-dice',
	standalone: true,
	imports: [],
	templateUrl: './dice.component.html',
	styleUrl: './dice.component.css'
})
export class DiceComponent {
	public result: number = 0;
	public disabled: boolean = true;

	public constructor(private boardService: BoardService, private gameService: GameService) {
		this.subscribeToGameService();
	}

	private subscribeToGameService() {
		this.gameService.roll$.subscribe((result) => {
			console.log(result);
			this.result = result;
		});
	}

	roll() {
		this.result = Math.floor(Math.random() * (6) + 1);
		this.boardService.getRollResult(this.result);
	}
}
