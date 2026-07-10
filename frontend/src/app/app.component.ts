import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';

@Component({
	selector: 'app-root',
	imports: [LobbyComponent],
	templateUrl: './app.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'chinese-app';
}
