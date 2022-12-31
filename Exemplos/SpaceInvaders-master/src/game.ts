import "phaser";
import { X_MAX, Y_MAX } from "./global";
import Level from "./level";
import MainMenu from "./mainMenu";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#60a797",
  width: X_MAX, // canvas properties
  height: Y_MAX, // canvas properties,
  physics: {
    default: "arcade",
    arcade: {
      gravity: false,
      debug: false
    }
  },
  scene: [MainMenu, Level]
};

export class Game extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}

const game = new Game(config);
