import { Injectable } from '@angular/core';
import { BoardService } from './board.service';

@Injectable({
	providedIn: 'root'
})
export class GameService {
	private rollResult: number = 0;
	public playerColor = "red";

	constructor(private boardService: BoardService) {
		this.subscribeToBoardService();
	}

	private subscribeToBoardService() {
		this.boardService.getRollResult$.subscribe((result) => {
			this.rollResult = result;
		});
	}
}
