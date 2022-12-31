// Name of Class same as filename.

class Scene1 extends Phaser.Scene {
	constructor() {
		// bootGame will be Identifier for this Game
		super("bootGame");
	}

	preload() {
		// This just loads the image in the memory
		this.load.image("background", "assets/images/background.png");
		// this.load.image("ship", "assets/images/ship.png");
		// this.load.image("ship2", "assets/images/ship2.png");
		// this.load.image("ship3", "assets/images/ship3.png");


		this.load.spritesheet("ship", "assets/spritesheets/ship.png", {
			frameWidth: 16,
			frameHeight: 16
		});

		this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {
			frameWidth: 32,
			frameHeight: 16
		});

		this.load.spritesheet("ship3", "assets/spritesheets/ship3.png", {
			frameWidth: 32,
			frameHeight: 32
		});

		this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
			frameWidth: 16,
			frameHeight: 16
		});

		this.load.spritesheet("power-up", "assets/spritesheets/power-up.png", {
			frameWidth: 16,
			frameHeight: 16
		});
		
		this.load.spritesheet("player", "assets/spritesheets/player.png", {
			frameWidth: 16,
			frameHeight: 24
		});

		this.load.spritesheet("beam", "assets/spritesheets/beam.png", {
			frameWidth: 16,
			frameHeight: 16
		});

		this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");
	}

	create() {
		// Displaying Text in Scene1
		this.add.text(20, 20, "Loading game...");
		
		// Switiching to Scene2
		this.scene.start("playGame");

		// To create animation (copied from Scene2)
		this.anims.create({
			key: "ship1_anim", // Name of animation
			frames: this.anims.generateFrameNumbers("ship"), // Using frames from "ship" spritesheet
			frameRate: 20, // play at 20 frames per second
			repeat: -1 // For infinite loop (repeat) we user -1
		});

		this.anims.create({
			key: "ship2_anim", // Name of animation
			frames: this.anims.generateFrameNumbers("ship2"), // Using frames from "ship2" spritesheet
			frameRate: 20, // play at 20 frames per second
			repeat: -1 // For infinite loop (repeat) we user -1
		});

		this.anims.create({
			key: "ship3_anim", // Name of animation
			frames: this.anims.generateFrameNumbers("ship3"), // Using frames from "ship3" spritesheet
			frameRate: 20, // play at 20 frames per second
			repeat: -1 // For infinite loop (repeat) we user -1
		});

		this.anims.create({
			key: "explode_anim", // Name of animation
			frames: this.anims.generateFrameNumbers("explosion"), // Using frames from "animation" spritesheet
			frameRate: 20, // play at 20 frames per second
			repeat: 0,
			hideOnComplete: true // We want it to disappear after it plays once
		});

		this.anims.create({
			key: "red",
			frames: this.anims.generateFrameNumbers("power-up", {
				// Specifying different frames from the spritesheet. Open power-up sprite for clarity.
				start: 0,
				end: 1
			}),
			frameRate: 20,
			repeat: -1
		})

		this.anims.create({
			key: "gray",
			frames: this.anims.generateFrameNumbers("power-up", {
				// Specifying different frames from the spritesheet. Open power-up sprite for clarity.s
				start: 2,
				end: 3
			}),
			frameRate: 20,
			repeat: -1
		})

		this.anims.create({
			key: "thrust",
			frames: this.anims.generateFrameNumbers("player"),
			frameRate: 20,
			repeat: -1
		});

		this.anims.create({
			key: "beam_anim",
			frames: this.anims.generateFrameNumbers("beam"),
			frameRate: 20,
			repeat: -1
		});
	}
}