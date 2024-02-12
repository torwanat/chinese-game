import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css'
})
export class TileComponent {
  @Input() id = 0;
  @Input() visible = false;
  @Input() color = "";
  @Input() pawn = "none";
}
