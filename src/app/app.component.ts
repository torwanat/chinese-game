import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, LobbyComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'chinese-app';
}
