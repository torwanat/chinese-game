import { Component } from '@angular/core';
import { TileComponent } from '../tile/tile.component';
import { CommonModule } from '@angular/common';
import { tileIDs } from '../tileIDs';

type Tile = {
  id: number,
  color: string,
  visible: boolean
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TileComponent, CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})

export class BoardComponent {
  public tempList: Array<Tile> = [];

  /**
   *
   */
  constructor() {
    for (let i = 0; i < 121; i++) {
      let color = "";

      if (tileIDs.redSpawn.includes(i)) {
        color = "red";
      } else if (tileIDs.blueSpawn.includes(i)) {
        color = "blue";
      } else if (tileIDs.yellowSpawn.includes(i)) {
        color = "yellow";
      } else if (tileIDs.greensSpawn.includes(i)) {
        color = "green";
      } else if (tileIDs.redFinish.includes(i)) {
        color = "pink";
      } else if (tileIDs.blueFinish.includes(i)) {
        color = "lightblue";
      } else if (tileIDs.yellowFinish.includes(i)) {
        color = "lightyellow";
      } else if (tileIDs.greenFinish.includes(i)) {
        color = "lightgreen";
      }

      this.tempList.push({
        id: i,
        color,
        visible: tileIDs.tiles.includes(i)
      });
    }
  }
}
