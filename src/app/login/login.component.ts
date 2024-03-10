import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { getTranslation } from '../translate';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	public nick: string = "";
	public joinText: string = "Join";

	constructor(private gameService: GameService) {
		this.translate();
	}

	public updateNick(nick: string) {
		this.nick = nick;
	}

	private async translate() {
		this.joinText = await getTranslation(this.joinText, this.gameService.language);

		this.gameService.language$.subscribe(async (language: string) => {
			this.joinText = await getTranslation(this.joinText, language);
		});
	}

	public login() {
		this.gameService.playerNick = this.nick;
		this.nick = "";
	}
}
