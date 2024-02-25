import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Game, GameData, Pawn, Player, UpdateType } from './types';

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

	public playerColor: string = "red";
	public playerNick: string = "";
	private game: Game = {
		uid: "",
		status: 0,
		players: [],
		pawns: [],
		roll: 0
	}

	constructor() {
		this.gameStarted$ = this.gameStartedSubject.asObservable();
		this.players$ = this.playersSubject.asObservable();
		this.pawns$ = this.pawnsSubject.asObservable();
		this.roll$ = this.rollSubject.asObservable();
		this.startShortPolling();
	}

	private getNick() {
		let nick: string | null = "";
		while (nick == "") {
			nick = prompt("Podaj nick:");
		}
		return nick;
	}

	private async sendRequest(nick: string = "", color: string = "", uid: string = "") {
		const body = JSON.stringify({
			nick,
			color,
			uid
		});
		console.log(body);
		const response: Response = await fetch("http://localhost/chinese/lobbies.php", {
			method: "POST", body, headers: {
				"Content-Type": "application/json"
			}
		});
		const data = await response.json();

		if (data.status == "NO_NICK") {
			const playerNick: string | null = this.getNick();
			this.sendRequest(playerNick!);
		} else {
			this.playerNick = data.nick;
			this.playerColor = data.color;
			this.game.uid = data.game.uid;
			this.game.status = data.game.status;
			this.game.players = data.game.players;
			this.game.pawns = data.game.pawns;
			this.game.roll = data.game.roll;

			this.pawnsSubject.next(this.game.pawns);
			this.playersSubject.next(this.game.players);
			this.rollSubject.next(this.game.roll);
			this.gameStartedSubject.next(this.game.status == 1);
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
		console.log(status);
		this.sendRequest(this.playerNick, this.playerColor, this.game.uid);
	}

	private async startShortPolling() {
		await this.sendRequest();
		setInterval(() => this.sendRequest(this.playerNick, this.playerColor, this.game.uid), 3000);
	}
}
