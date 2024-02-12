import { Component } from '@angular/core';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.css'
})
export class DiceComponent {
  public id: number = 6;

  roll() {
    this.id = Math.floor(Math.random() * (6) + 1);
  }
}
