import { Component } from '@angular/core';
import { BoardService } from '../board.service';
import { GameService } from '../game.service';
import { Player } from '../types';
import { apiPrefix } from '../apiPrefix';
import { getTranslation } from '../translate';

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
	public rollText: string = "Roll";

	private voices: Array<SpeechSynthesisVoice> = [];

	public constructor(private boardService: BoardService, private gameService: GameService) {
		this.disabled = gameService.playerColor != "red";
		this.subscribeToGameService();
		this.populateVoiceList();
		this.translate();
	}

	private async translate() {
		this.rollText = await getTranslation(this.rollText, this.gameService.language);

		this.gameService.language$.subscribe(async (language: string) => {
			this.rollText = await getTranslation(this.rollText, language);
		});
	}

	private subscribeToGameService() {
		this.gameService.roll$.subscribe((result: number) => {
			this.result = result;
		});
		this.gameService.players$.subscribe((players: Array<Player>) => {
			this.disabled = this.gameService.playerStatus != 3;
		});

		this.disabled = this.gameService.playerStatus != 3;
	}

	public roll() {
		this.result = Math.floor(Math.random() * (6) + 1);
		this.speak(this.gameService.language);
		this.boardService.getRollResult(this.result);
	}

	private populateVoiceList() {
		const synth = window.speechSynthesis;
		this.voices = synth.getVoices();
	}

	private speak(language: string) {
		let voice: SpeechSynthesisVoice = this.voices[0];

		for (let i: number = 0; i < this.voices.length; i++) {
			if (this.voices[i].lang.includes(language)) {
				voice = this.voices[i];
				break;
			}
		}
		const utterance = new SpeechSynthesisUtterance(this.result.toString());
		utterance.voice = voice;
		utterance.pitch = 1;
		utterance.rate = 1;
		speechSynthesis.speak(utterance);
	}
}
