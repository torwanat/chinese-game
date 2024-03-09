import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Game, Pawn, Player, UpdateType } from './types';

@Injectable({
	providedIn: 'root'
})
export class GameService {
	public gameStarted$: Observable<boolean>;
	private gameStartedSubject = new Subject<boolean>();

	public players$: Observable<Array<Player>>;
	private playersSubject = new Subject<Array<Player>>();

	public pawns$: Observable<Array<Pawn>>;
	private pawnsSubject = new Subject<Array<Pawn>>();

	public roll$: Observable<number>;
	private rollSubject = new Subject<number>();

	public winner$: Observable<string>;
	private winnerSubject = new Subject<string>();

	public timestamp$: Observable<number>;
	private timestampSubject = new Subject<number>();

	public playerColor: string = "red";
	public playerNick: string = "";
	public playerStatus: number = 0;
	private game: Game = {
		uid: "",
		status: 0,
		players: [],
		pawns: [],
		roll: 0,
		winner: "",
		timestamp: 0
	}

	public language: string = "pol";

	constructor() {
		this.gameStarted$ = this.gameStartedSubject.asObservable();
		this.players$ = this.playersSubject.asObservable();
		this.pawns$ = this.pawnsSubject.asObservable();
		this.roll$ = this.rollSubject.asObservable();
		this.winner$ = this.winnerSubject.asObservable();
		this.timestamp$ = this.timestampSubject.asObservable();
		this.startShortPolling();
	}

	private async sendRequest(nick: string = "", color: string = "", uid: string = "") {
		const body = JSON.stringify({
			nick,
			color,
			uid
		});
		const response: Response = await fetch("http://localhost/chinese/lobbies.php", {
			method: "POST", body, headers: {
				"Content-Type": "application/json"
			}
		});
		const data = await response.json();

		if (data.status != "NO_NICK") {
			this.playerNick = data.nick;
			this.playerColor = data.color;
			localStorage.setItem("session", JSON.stringify({
				uid: data.game.uid,
				nick: this.playerNick,
				color: this.playerColor
			}));

			for (let i = 0; i < data.game.players.length; i++) {
				const player: Player = data.game.players[i];
				if (player.color == this.playerColor) {
					this.playerStatus = player.status;
					break;
				}
			}

			this.timestampSubject.next(data.game.timestamp);
			this.pawnsSubject.next(data.game.pawns);
			this.playersSubject.next(data.game.players);
			this.rollSubject.next(data.game.roll);
			this.gameStartedSubject.next(data.game.status == 1);
			this.winnerSubject.next(data.game.winner);
			this.game = data.game;
		}
	}

	public async updateMade(type: UpdateType, pawns?: Array<Pawn>, roll?: number) {
		const body = JSON.stringify({
			type,
			nick: this.playerNick,
			color: this.playerColor,
			uid: this.game.uid,
			pawns,
			roll
		});
		const response = await fetch("http://localhost/chinese/lobbies.php", {
			method: "POST", body, headers: {
				"Content-Type": "application/json"
			}
		});
		const status = await response.json();
		this.sendRequest(this.playerNick, this.playerColor, this.game.uid);
	}

	private async startShortPolling() {
		let previousSession: { [key: string]: string } = {
			nick: "",
			color: "",
			uid: ""
		};
		if (localStorage.getItem("session")) {
			previousSession = JSON.parse(localStorage.getItem("session")!.toString());
		}
		await this.sendRequest(previousSession['nick'], previousSession['color'], previousSession['uid']);
		setInterval(() => this.sendRequest(this.playerNick, this.playerColor, this.game.uid), 3000);
	}

	public changeLanguage(language: string) {
		this.language = language;
	}
}
