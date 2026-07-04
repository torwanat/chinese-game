import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { apiPrefix } from '../apiPrefix';
import { getTranslation } from '../translate';

@Component({
	selector: 'app-language',
	standalone: true,
	imports: [],
	templateUrl: './language.component.html',
	styleUrl: './language.component.css'
})
export class LanguageComponent {
	public chooseLanguageText: string = "Choose language: ";
	public polish: string = "Polish";
	public english: string = "English";

	constructor(private gameService: GameService) {
		this.translate();
	}

	private async translate() {
		this.chooseLanguageText = await getTranslation(this.chooseLanguageText, this.gameService.language);
		this.polish = await getTranslation(this.polish, this.gameService.language);
		this.english = await getTranslation(this.english, this.gameService.language);

		this.gameService.language$.subscribe(async (language: string) => {
			this.chooseLanguageText = await getTranslation(this.chooseLanguageText, language);
			this.polish = await getTranslation(this.polish, language);
			this.english = await getTranslation(this.english, language);
		});
	}

	public languageChanged(language: string) {
		this.gameService.changeLanguage(language);
	}
}
