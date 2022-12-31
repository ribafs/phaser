import { FONT_FAMILY } from "./global";
export default class MainMenu extends Phaser.Scene {
  private readonly HEADER_TEXT = "Space Invaders";

  constructor() {
    super("MainMenu");
  }

  preload() {}

  create() {
    const header = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2 - 100,
      this.HEADER_TEXT,
      {
        fontFamily: FONT_FAMILY,
        fontSize: "50px",
        fill: "#fff"
      }
    );
    header.setOrigin(0.5);

    const startGameTxt = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      "START GAME",
      {
        fontFamily: FONT_FAMILY,
        fontSize: "25px",
        fill: "#59311f"
      }
    );
    startGameTxt.setOrigin(0.5);

    startGameTxt
      .setInteractive()
      .on("pointerover", () => this.input.setDefaultCursor("pointer"))
      .on("pointerout", () => this.input.setDefaultCursor("auto"))
      .on("pointerdown", () => {
        console.log("starting game");
        this.scene.start("Level");
      });
  }
}
