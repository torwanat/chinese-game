import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { DiceComponent } from '../dice/dice.component';
import { GameService } from '../game.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Player } from '../types';

@Component({
	selector: 'app-lobby',
	standalone: true,
	imports: [BoardComponent, DiceComponent, CommonModule],
	templateUrl: './lobby.component.html',
	styleUrl: './lobby.component.css'
})
export class LobbyComponent {
	public gameStarted: boolean = false;
	public players: Array<Player> = [];
	public ready: boolean = false;

	constructor(private gameService: GameService) {
		this.subscribeToGameService();
	}

	private subscribeToGameService() {
		this.gameService.gameStarted$.subscribe((gameStarted) => {
			this.gameStarted = gameStarted;
		});

		this.gameService.players$.subscribe((players) => {
			const tempPlayers: Array<Player> = [...players];
			for (let i = tempPlayers.length; i < 4; i++) {
				tempPlayers.push({
					nick: "",
					status: -1,
					color: "none"
				});
			}
			this.players = tempPlayers;
		});
	}

	public toggleReady() {
		this.ready = !this.ready;
		this.players.forEach(player => {
			if (player.color == this.gameService.playerColor) {
				player.status == 1 ? player.status = 0 : player.status = 1;
			}
		});

		this.gameService.updateMade("STATUS");
	}
}
