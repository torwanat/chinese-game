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
	public result: number = 6;
	public disabled: boolean = true;
	public dice: string = "\u2680\u2681\u2682\u2683\u2684\u2685";

	private voices: Array<SpeechSynthesisVoice> = [];

	public constructor(private boardService: BoardService, private gameService: GameService) {
		this.disabled = gameService.playerColor != "red";
		this.subscribeToGameService();
		this.populateVoiceList();
	}

	private subscribeToGameService() {
		this.gameService.roll$.subscribe((result: number) => {
			this.result = result;
		});
		this.gameService.players$.subscribe((players: Array<Player>) => {
			this.disabled = this.gameService.playerStatus != 3;
		});
	}

	public roll() {
		this.result = Math.floor(Math.random() * (6) + 1);
		this.speak(this.gameService.language);
		// this.result = 6;
		this.boardService.getRollResult(this.result);
	}

	private populateVoiceList() {
		const synth = window.speechSynthesis;
		this.voices = synth.getVoices();
	}

	private speak(language: string) {
		const utterance = new SpeechSynthesisUtterance(this.result.toString());
		utterance.voice = this.voices[language == "pol" ? 1 : 3];
		utterance.pitch = 1;
		utterance.rate = 1;
		speechSynthesis.speak(utterance);
	}
}
