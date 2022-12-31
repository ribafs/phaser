var gameSettings, config;
window.onload = function () {

	gameSettings = {
		playerSpeed: 200
	}

	config = {
		width: 256,
		height: 272,
		backgroundColor: 0x000000,
		scene: [Scene1, Scene2],
		pixelArt: true,
		// Added for Physics Engine
		physics: {
			default: "arcade",
			arcade: {
				debug: false
			}
		}
	}

	// Creating new instance of Phaser Game
	var game = new Phaser.Game(config);

	
}