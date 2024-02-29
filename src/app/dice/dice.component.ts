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
	public result: number = 0;
	public disabled: boolean = true;

	public constructor(private boardService: BoardService, private gameService: GameService) {
		this.disabled = gameService.playerColor != "red";
		this.subscribeToGameService();
	}

	private subscribeToGameService() {
		this.gameService.roll$.subscribe((result: number) => {
			console.log(result);
			this.result = result;
		});
		this.gameService.players$.subscribe((players: Array<Player>) => {
			console.log("morbius");

			for (let i = 0; i < players.length; i++) {
				const player: Player = players[i];
				if (player.color == this.gameService.playerColor) {
					this.disabled = player.status == 2;
					break;
				}
			}
		});
	}

	roll() {
		this.result = Math.floor(Math.random() * (6) + 1);
		this.boardService.getRollResult(this.result);
		this.disabled = true;
	}
}
