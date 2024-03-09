import { Component } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { DiceComponent } from '../dice/dice.component';
import { GameService } from '../game.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Player } from '../types';
import { LanguageComponent } from '../language/language.component';
import { LoginComponent } from '../login/login.component';

@Component({
	selector: 'app-lobby',
	standalone: true,
	imports: [BoardComponent, DiceComponent, LanguageComponent, CommonModule, LoginComponent],
	templateUrl: './lobby.component.html',
	styleUrl: './lobby.component.css'
})
export class LobbyComponent {
	public gameStarted: boolean = false;
	public players: Array<Player> = [];
	public ready: boolean = false;
	public winner: string = "";
	public timeLeft: number = -1;
	public playerNick: string = "";
	private timestamp: number = -1;

	constructor(private gameService: GameService) {
		this.subscribeToGameService();
		this.countTime();
	}

	private countTime() {
		setInterval(() => {
			if (this.timestamp > 0) {
				this.timeLeft = Math.max(0, 60 - Math.round((Date.now() - (this.timestamp * 1000)) / 1000));
			}
		}, 500);
	}

	private subscribeToGameService() {
		this.gameService.gameStarted$.subscribe((gameStarted) => {
			this.gameStarted = gameStarted;
		});

		this.gameService.winner$.subscribe((winner: string) => {
			this.winner = winner;
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

			this.playerNick = this.gameService.playerNick;
		});

		this.gameService.timestamp$.subscribe((timestamp: number) => {
			this.timestamp = timestamp;
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
