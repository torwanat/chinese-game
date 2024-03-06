import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
	selector: 'app-language',
	standalone: true,
	imports: [],
	templateUrl: './language.component.html',
	styleUrl: './language.component.css'
})
export class LanguageComponent {
	constructor(private gameService: GameService) { }

	public languageChanged(language: string) {
		this.gameService.changeLanguage(language);
	}
}
