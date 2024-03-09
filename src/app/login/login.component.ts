import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	public nick: string = "";

	constructor(private gameService: GameService) { }

	public updateNick(nick: string) {
		this.nick = nick;
	}

	public login() {
		this.gameService.playerNick = this.nick;
		this.nick = "";
	}
}
