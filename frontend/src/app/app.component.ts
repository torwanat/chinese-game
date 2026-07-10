import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LobbyComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'chinese-app';
}
