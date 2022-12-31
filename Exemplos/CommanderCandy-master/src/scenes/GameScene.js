import Phaser from "phaser";

import { POINTS_FOR_KILL, POINTS_FOR_CANDY, MUSIC_VOLUME } from "../game/Globals";

import PlatformManager from "../managers/PlatformManager";
import AssetManager from "../managers/AssetManager";
import EnemyManager from "../managers/EnemyManager";
import UserInterface from "../game/UserInterface";
import Player from "../game/Player";
import Candy from "../game/Candy";

export default class GameScene extends Phaser.Scene {

    constructor(game) {
        super("game");

        this._game = game;
        this._player = null;
        this._cursors = null;
        this._bombs = null;
        this._gameOver = false;
        this._gameOn = true;
        this._music = null;

        this._gamepad = null;
        this._gamepadPresent = false;
        
        // custom event dispatcher object - passed into to objects that need to dispatch
        this._emitter = new Phaser.Events.EventEmitter();

        // spritemanager handles all adding sprites to the game (animated or static)
        this._assetManager = new AssetManager(this);

        // constructing other managers and pass in Scene object / assetManager
        this._userInterface = new UserInterface(this, this._assetManager);
        this._platformManager = new PlatformManager(this, this._assetManager, this._emitter);
        this._player = new Player(this, this._assetManager, this._platformManager, this._emitter);
        this._candy = new Candy(this, this._assetManager, this._platformManager, this._emitter, this._player);
        this._enemyManager = new EnemyManager(this, this._assetManager, this._platformManager, this._emitter, this._player);
    }

    // ----------------------------------- scene methods
    // each scene has its own displaylist
    preload() {
        // manager object preload stage setup
        this._userInterface.preload();
        this._platformManager.preload();
        this._player.preload();
        this._candy.preload();
        this._enemyManager.preload();
    }
  
    create() {
        // guaranteed all assets loaded when in this scene function

        // initialization
        this._gameOn = true;

        // other setups
        this._userInterface.setup();
        this._platformManager.setup();
        this._player.setup();
        this._candy.setup();
        this._enemyManager.setup();

        // setup keyboard controls
        this._cursors = this.input.keyboard.createCursorKeys();
        this._fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // setup gamepad if present
        this.input.gamepad.once('down', function (pad, button, index) {
            console.log("Gamepad connected: " + pad.id);
            this._gamepad = pad;
            this._gamepadPresent = true;
        }, this);

        // setup music
        this._music = this._assetManager.addSound("musicGame", {
            volume: MUSIC_VOLUME,
            loop: true
        });
        this._music.play();

        // setup game listeners - but first removes ones from previous game
        this._emitter.removeAllListeners();
        this._emitter.on("GameEvent", this._onGameEvent, this);
    }

    update() {
        if (!this._game.scene.isActive("game") || (!this._gameOn)) return;

        if (this._gamepadPresent) {
            // gamepad control monitoring
            if ((this._gamepad.buttons[0].value == 1) || (this._gamepad.buttons[3].value == 1)) this._cursors.up.isDown = true;
            else this._cursors.up.isDown = false;
            if ((this._gamepad.buttons[1].value == 1) || (this._gamepad.buttons[2].value == 1)) this._fireKey.isDown = true;
            else this._fireKey.isDown = false;

            if (this._gamepad.axes[0].value < -0.5) this._cursors.left.isDown = true;
            else if (this._gamepad.axes[0].value > 0.5) this._cursors.right.isDown = true;
            else {
                this._cursors.right.isDown = false;
                this._cursors.left.isDown = false;
            }
        }

        // keyboard control monitoring
        // monitor player movement
        if (this._cursors.left.isDown) this._player.moveLeft();
        else if (this._cursors.right.isDown) this._player.moveRight();
        else this._player.stop();
        // monitor player jump
        if (this._cursors.up.isDown) this._player.jump();
        // monitor player shooting
        if (this._fireKey.isDown) this._player.fire();

        // game object updates
        this._player.update();
    }

    //--------------------------------------------------------------- event handlers
    _onGameEvent(which) {

        console.log("game event! " + which);

        switch (which) {
            case "EnemyKilled":
                this._userInterface.updateScore(POINTS_FOR_KILL);
                break;
            case "CandyPickup":
                this._userInterface.updateScore(POINTS_FOR_CANDY);
                // move to next level
                this._platformManager.levelUp();
                this._enemyManager.levelUp();
                break;
            case "LevelReady":
                this._candy.release();
                this._player.release();
                break;
            case "PlayerHurt":
                this._userInterface.updateHealth(this._player.health);
                break;
            case "PlayerKilled":
                this._gameOn = false;
                break;
            case "GameOver":
                // stop the game
                this._music.stop();
                this._game.scene.stop("game");
                this._game.scene.start("gameover");
                break;
        }
    }

}