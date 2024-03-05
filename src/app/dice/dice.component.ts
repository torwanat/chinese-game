import { Component } from '@angular/core';
import { BoardService } from '../board.service';
import { GameService } from '../game.service';
import { Player } from '../types';

@Component({
	selector: 'app-dice',
	standalone: true,
	imports: [],
	templateUrl: './dice.component.html',
	styleUrl: './dice.component.css'
})
export class DiceComponent {
	public result: number = 6;
	public disabled: boolean = true;
	public dice: string = "\u2680\u2681\u2682\u2683\u2684\u2685";

	public constructor(private boardService: BoardService, private gameService: GameService) {
		this.disabled = gameService.playerColor != "red";
		this.subscribeToGameService();
	}

	private subscribeToGameService() {
		this.gameService.roll$.subscribe((result: number) => {
			this.result = result;
		});
		this.gameService.players$.subscribe((players: Array<Player>) => {
			this.disabled = this.gameService.playerStatus != 3;
		});
	}

	roll() {
		this.result = Math.floor(Math.random() * (6) + 1);
		// this.result = 6;
		this.boardService.getRollResult(this.result);
	}
}
