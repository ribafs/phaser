import {
  ALIEN_SHIP_HEIGHT,
  ALIEN_SHIP_WIDTH,
  FONT_FAMILY,
  X_MAX,
  Y_MAX
} from "./global";

export enum EnemyDirections {
  LEFT,
  RIGHT,
  DOWN,
  UP
}

export default class Level extends Phaser.Scene {
  // player properties
  private isPlayerAlive: boolean = true;

  // enemy properties
  private readonly MAX_ENEMIES = 9;
  private ENEMY_X_MOVE_SPEED = 200;
  private row1Direction: EnemyDirections = EnemyDirections.RIGHT;
  private row2Direction: EnemyDirections = EnemyDirections.RIGHT;

  // player and alien physics object(s)
  private alienShipRow1: Phaser.Physics.Arcade.Group;
  private alienShipRow2: Phaser.Physics.Arcade.Group;
  private player: Phaser.Physics.Arcade.Sprite & {
    body: Phaser.Physics.Arcade.Body;
  };

  constructor() {
    super("Level");
  }

  preload() {
    this.load.svg("playerShip", "assets/player-ship.svg");
    this.load.svg("alienShip", "assets/alien-ship.svg");
    this.load.svg("alienShipCircular", "assets/alien-ship-circular.svg");
    this.isPlayerAlive = true;
  }

  create() {
    // ** NOTE: create() is only called the first time the scene is created
    // it does not get called when scene is restarted or reloaded
    this.setPlayer();
    this.setEnemies();
    this.physics.add.overlap(this.alienShipRow1, this.player);
    this.physics.add.overlap(this.alienShipRow2, this.player);
  }

  update() {
    if (!this.player.body.touching.none) {
      // player has touched a spaceship
      this.playerDeath();
    }
    if (this.isPlayerAlive) {
      this.setPlayerMovement();
      this.row1Direction = this.moveEnemies(
        this.alienShipRow1,
        this.row1Direction
      );
      this.row2Direction = this.moveEnemies(
        this.alienShipRow2,
        this.row2Direction
      );
    }
  }

  private setPlayer() {
    this.player = this.physics.add.image(X_MAX / 2, Y_MAX, "playerShip") as any;
    this.player.setCollideWorldBounds(true);
  }

  private setEnemies() {
    this.alienShipRow1 = this.physics.add.group({
      key: "alienShip",
      repeat: this.MAX_ENEMIES,
      setXY: {
        x: 80,
        y: ALIEN_SHIP_HEIGHT,
        stepX: ALIEN_SHIP_WIDTH + 10
      },
      collideWorldBounds: true
    });
    this.alienShipRow2 = this.physics.add.group({
      key: "alienShipCircular",
      repeat: this.MAX_ENEMIES,
      setXY: {
        x: 80,
        y: ALIEN_SHIP_HEIGHT * 2,
        stepX: ALIEN_SHIP_WIDTH + 10
      },
      collideWorldBounds: true
    });
  }

  private setPlayerMovement() {
    const cursorKeys = this.input.keyboard.createCursorKeys();

    if (cursorKeys.right.isDown) {
      this.player.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.player.body.setVelocityX(-500);
    } else {
      this.player.body.setVelocity(0);
    }
  }

  /**
   * Moves enemies and returns the current direction of the enemies
   * @param enemyGroup
   * @param enemyDirection
   */
  private moveEnemies(
    enemyGroup: Phaser.Physics.Arcade.Group,
    enemyDirection: EnemyDirections
  ): EnemyDirections {
    let updatedDirection = enemyDirection;
    if (enemyDirection === EnemyDirections.RIGHT) {
      Phaser.Actions.Call(
        enemyGroup.getChildren(),
        (go: any) => {
          if (go.body.x < X_MAX - ALIEN_SHIP_WIDTH) {
            go.setVelocityX(this.ENEMY_X_MOVE_SPEED);
          } else {
            updatedDirection = EnemyDirections.DOWN;
          }
        },
        this
      );
    } else if (enemyDirection === EnemyDirections.DOWN) {
      Phaser.Actions.Call(
        enemyGroup.getChildren(),
        (go: any) => {
          go.body.y += ALIEN_SHIP_HEIGHT;
          updatedDirection =
            go.body.x >= X_MAX - ALIEN_SHIP_WIDTH
              ? EnemyDirections.LEFT
              : EnemyDirections.RIGHT;
        },
        this
      );
    } else {
      Phaser.Actions.Call(
        enemyGroup.getChildren(),
        (go: any) => {
          if (go.body.x > 0) {
            go.setVelocityX(-this.ENEMY_X_MOVE_SPEED);
          } else {
            updatedDirection = EnemyDirections.DOWN;
          }
        },
        this
      );
    }
    return updatedDirection;
  }

  private stopEnemies(enemyGroup: Phaser.Physics.Arcade.Group) {
    Phaser.Actions.Call(
      enemyGroup.getChildren(),
      (go: any) => {
        go.setVelocityX(0);
      },
      this
    );
  }

  /**
   * Triggers player death as well as stops all movement and sets up
   * game over screen
   */
  private playerDeath() {
    this.isPlayerAlive = false;
    this.stopEnemies(this.alienShipRow1);
    this.stopEnemies(this.alienShipRow2);
    this.player.body.setVelocityX(0);

    this.cameras.main.shake(100);

    // add game over screen
    this.setGameOverScreen();
  }

  private setGameOverScreen() {
    const gameOver = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2 - 100,
      "GAME OVER",
      {
        fontFamily: FONT_FAMILY,
        fontSize: "50px",
        fill: "#fff"
      }
    );
    gameOver.setOrigin(0.5);

    const mainMenuTxt = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      "Main Menu",
      {
        fontFamily: FONT_FAMILY,
        fontSize: "25px",
        fill: "#59311f"
      }
    );
    mainMenuTxt.setOrigin(0.5);

    mainMenuTxt
      .setInteractive()
      .on("pointerover", () => this.input.setDefaultCursor("pointer"))
      .on("pointerout", () => this.input.setDefaultCursor("auto"))
      .on("pointerdown", () => this.scene.start("MainMenu"));

    const tryAgainTxt = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2 + 40,
      "Try Again",
      {
        fontFamily: FONT_FAMILY,
        fontSize: "25px",
        fill: "#59311f"
      }
    );
    tryAgainTxt.setOrigin(0.5);

    tryAgainTxt
      .setInteractive()
      .on("pointerover", () => this.input.setDefaultCursor("pointer"))
      .on("pointerout", () => this.input.setDefaultCursor("auto"))
      .on("pointerdown", () => this.restart());
  }

  private restart() {
    this.scene.restart();
    this.isPlayerAlive = true;
  }
}
