// Name of Class same as filename.
class Scene2 extends Phaser.Scene {
	constructor() {
		// playGame will be Identifier for this Game
		super("playGame");
	}


	create() {
		// Using config defined in game.js
		this.config = this.game.config;
		var config = this.config;

		// Creating a class variable for background named this.background
		// this.background = this.add.image(0,0,"background");
		this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
		this.background.setOrigin(0,0);

		// Old declaration using Image
		// this.ship1 = this.add.image(config.width/2 - 50, config.height/2, "ship");
		// this.ship2 = this.add.image(config.width/2, config.height/2, "ship2");
		// this.ship3 = this.add.image(config.width/2 + 50, config.height/2, "ship3");
		
		// New declaration using Sprite
		this.ship1 = this.add.sprite(config.width/2 - 50, config.height/2, "ship");
		this.ship2 = this.add.sprite(config.width/2, config.height/2, "ship2");
		this.ship3 = this.add.sprite(config.width/2 + 50, config.height/2, "ship3");

		// Adding Enemy Ships to a group
		this.enemies = this.physics.add.group(); // Creating a group
		this.enemies.add(this.ship1); // Added Ship1
		this.enemies.add(this.ship2); // Added Ship2
		this.enemies.add(this.ship3); // Added Ship3

		// Create animation code moved to Scene1

		// Creating a group to add objects.
		this.powerUps = this.physics.add.group();

		var maxObjects = 4;
		for (var i = 0; i <= maxObjects; ++i) {
			// Creating Powerup
			var powerUp = this.physics.add.sprite(16, 16, "power-up");
			// Adding to group
			this.powerUps.add(powerUp);
			// Putting them at random position on the screen.
			powerUp.setRandomPosition(0, 0, config.width, config.height);

			// Playing random animation for PowerUp
			if (Math.random() > 0.5) {
				powerUp.play("red");
			} else {
				powerUp.play("gray");
			}

			// Setting velocity
			powerUp.setVelocity(100, 100);
		
			// Setting Boundaries
			powerUp.setCollideWorldBounds(true);
		
			// Enable Bounce
			powerUp.setBounce(1); // The higher the value the higher the return velocity after collision
		}

		// Playing animations
		this.ship1.play("ship1_anim");
		this.ship2.play("ship2_anim");
		this.ship3.play("ship3_anim");

		// Making ships interactive
		this.ship1.setInteractive();
		this.ship2.setInteractive();
		this.ship3.setInteractive();

		// Event that listens whenever an interactive object is clicked
		this.input.on("gameobjectdown", this.destroyShip, this);

		// Adding Player
		this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
		this.player.play("thrust");

		// Listens to keyboard event
		this.cursorKeys = this.input.keyboard.createCursorKeys();

		// Setting boundaries for player
		this.player.setCollideWorldBounds(true);
	
		// Adding Key for Player to shoot
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
	
		// Creating group to add all "beam" instances. Instances will be added in Beam class in "beam.js"
		this.projectiles = this.add.group();
	
		// Enabling collision between "projectiles" and "powerUps"
		this.physics.add.collider(this.projectiles, this.powerUps, function (projectile, powerUp) {
			// projectile and powerUp are the objects that collided.

			// Destroying Projectile when it collides with PowerUp.
			projectile.destroy();
		});

		// Enabling Picking PowerUps
		this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);

		// Enabling Overlap between Enemy and Player's Ship
		this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);

		// Enabling Overlap between Player's Beam and Enemy Ship
		this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

		// Adding Backgroud behind SCORE text
		// Add a shape with black solid fill
		var graphics = this.add.graphics();
		graphics.fillStyle(0x000000, 1);

		// Draw the Polygon Lines with coordinates.
		graphics.beginPath();
		graphics.moveTo(0, 0);
		graphics.lineTo(config.width, 0);
		graphics.lineTo(config.width, 20);
		graphics.lineTo(0, 20);
		graphics.lineTo(0, 0);

		// Close the path and fill the shape.
		graphics.closePath();
		graphics.fillPath();

		// Variable to keep track of the score
		this.score = 0;

		// Adding ScoreLabel
		this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE", 16); 
		// 10, 5 is the position
		// "pixlefont" is the ID of font we created in Scene1 preload()
		// "SCORE" is the text to display
		// 16 is the font size
	}

	// Function to Add Zero Padding in front of Score
	zeroPad(number, size){
    	var stringNumber = String(number);
    	while(stringNumber.length < (size || 2)){
        	stringNumber = "0" + stringNumber;
      	}
      	return stringNumber;
  	}

	hitEnemy(projectile, enemy) {

		// Explosion effect when beam hits enemy ships.
		var explosion = new Explosion(this, enemy.x, enemy.y);

		// Destroying projectile
		projectile.destroy();

		// EResetting Enemy Ship Position
		this.resetShipPos(enemy);

		// Increasing Score
		this.score += 15;
		// Adding zero padding to score
		var scoreFormated = this.zeroPad(this.score, 6);
		this.scoreLabel.text = `SCORE ${scoreFormated}`; 
	}

	hurtPlayer(player, enemy) {
		// Resetting Enemy Ship Position
		this.resetShipPos(enemy);

		if(this.player.alpha < 1) {
			// If the player has just respawned.
			return;
		}

		// Old Code
		// // Resetting Player's position
		// player.x = config.width / 2 - 8;
		// player.y = config.height - 64;
	
		// Now added explosion
		var explosion = new Explosion(this, player.x, player.y);
	
		// Removing player form screen
		player.disableBody(true, true); // active property is set to false. We will use this as a flag in shootBeam function
	

		// this.resetPlayer();
		// Instead of directly calling resetPlayer(), we will add a delay of 1 seconds first.
		this.time.addEvent({
			delay: 1000, // Call callback (here resetPlayer) after 1000ms have elapsed.
			callback: this.resetPlayer,
			callbackScope: this,
			loop: false
		});
	}

	resetPlayer() {
		var x = config.width / 2 - 8;
		var y = config.height + 64; // When ship is destroyed it is hidden at the bottom of the screen
		// Enabling the Player again
		this.player.enableBody(true, x, y, true, true);
	
		// Making player transparent so that it is not killed immediately after re-spawning.
		this.player.alpha = 0.5;

		// Adding a tween
		var tween = this.tweens.add({
			targets: this.player, // Tween will target our ship
			y: config.height - 64, // Tells ship to move 64 pixels above the bottom of the ship.
			ease: "Power1",
			duration: 1500, // Duration is of one an d a half seconds.
			repeat: 0,
			onComplete: function () { // When tween is complete, we remove the transparency of the ship.
				this.player.alpha = 1;
			},
			callbackScope: this
		});
	}

	pickPowerUp(player, powerUp) {
		// player and powerUp are the two objects overlapping
		// Disable the physics of powerup objects
		powerUp.disableBody(true, true); // Two parameters set to true, make it inactive and hide it from the display list.
	}

	update() {
		this.moveShip(this.ship1, 1);
		this.moveShip(this.ship2, 2);
		this.moveShip(this.ship3, 3);

		// For Background texture moving effect
		this.background.tilePositionY -= 0.5;
	
		// To move Player's Ship.
		this.movePlayerManager();

		// If Spacebar was just pressed down
		if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			// console.log("Fire");
			// Function that will shoot the beam.
			if(this.player.active){
				this.shootBeam();
			}
		}

		// Iterating thorugh each "beam" instance and calling beam.update()
		for(var i = 0; i < this.projectiles.getChildren().length; ++i) {
			var beam = this.projectiles.getChildren()[i];
			beam.update();
		}
	}

	shootBeam() {
		// We could have done this, but we will use custom classes.
		// var beam = this.physics.add.sprite(this.player.x, this.player.y, "beam");
		var beam = new Beam(this); // this represent an object of current Scene.
	}

	movePlayerManager() {
		if(this.cursorKeys.left.isDown) { // Every time Left Arrow is pressed
			this.player.setVelocityX(-gameSettings.playerSpeed);
		} else if(this.cursorKeys.right.isDown) { // Every time Right Arrow is pressed
			this.player.setVelocityX(gameSettings.playerSpeed);
		}

		if(this.cursorKeys.up.isDown) { // Every time Left Arrow is pressed
			this.player.setVelocityY(-gameSettings.playerSpeed);
		} else if(this.cursorKeys.down.isDown) { // Every time Right Arrow is pressed
			this.player.setVelocityY(gameSettings.playerSpeed);
		}
	}

	moveShip(ship, speed) {
		// Function to move the ship in vertical axis.
		ship.y += speed;
		if (ship.y > this.config.height) {
			this.resetShipPos(ship);
		}
	}

	resetShipPos(ship) {
		// Resets Y and sets random X coordinate.
		ship.y = 0;
		var randomX = Phaser.Math.Between(9, this.config.width);
		ship.x = randomX;
	}

	destroyShip(pointer, gameObject) {
		// pointer: Mouse Pointer (in case we need it, though we won't need it here)
		// gameObj: Object (ship) in this case.
		gameObject.setTexture("explosion"); // Texture switched to explosion spritesheet.
		gameObject.play("explode_anim"); // Play explode animation
	}
}

/*
	Scenes are controlled by following flow of functions:
	1. init(): Used to prepare the data.
	2. preload(): Used to load music and images into memory.
	3. create(): Used to add objects to the game.
	4. update(): It is a loop that runs constantly.

	Loading Objects (Images) into memory:
	this.load.image("key", "url");
	key: A string to identify the image
	url: A string path to the image file

	Displaying image into scene:
	this.add.image(X,Y,"key")
	X: X coordinate
	Y: Y coordinate
	key: A string to identify the image

	Image Properties:
	1. Change Scale: this.ship1.setScale(2);
	2. Flip on both axes: this.ship1.flipY = true; this.ship1.flipX = true;
	3. Rotate continuously (from inside update() function): this.ship1.angle += 3;

	Making ships fly down:
	1. First thing we will do is to move the ship on the vertical axis by increasing it's Y value.
	2. When it reaches bottom of the screen, move it back to top of the screen.
	3. We will make a function to handle this.
	4. We will call this function in update() block for each ship at different speeds.
	5. We will also make a function to reset ships position once it reaches the bottom of the screen.

	Making Background Scroll:
	1. Change definition of the background from image to TileSprite.
	TileSprite: It is a sprite that has a repeating texture. So, instead of moving the image, we will move
	the texture of image.

	Animations in Phaser: Spritesheets
	In order to make animations in Phaser, we need to use Spritesheets.
	Spritesheet: It is a collection of images in a single file seprarated by frames.
	Using spritesheet in Phaser is more expensive for processor that's why we did not use it for Images.
	1. We will load spritesheet instead of loading image.

	Creating Animation:
	1. Using the create animation function, we can define the animation using various parameters
	this.anims.create({ key, frames, frameRate, repeat });
	key: ID for this animation
	frames: An array of frames
	frameRate: The speed of the animation
	repeat: Will it loop?
	2. We will add this function inside create() function.
	3. To play the animation, this.ship.play("ship1_anim"); inside create().

	Making Ships Interactive:
	1. To Make ships interactive, we have to enable them to receive input using following function,
	this.ship1.setInteractive();
	2. We will add an event that listens whenever an interactive object is clicked,
	this.input.on("gameobjectdown", this.destroyShip, this);
	"gameobjectdown": defines that the event triggers when the object is clicked and it automatically
	scopes the callback function to the object itself, in this case the ship.
	this.destroyShip(): Callback function to be called.
	this: To pass the scope to the callback function.
	
	Adding Physics Engine:
	1. We will use Arcade Physics which is extremely lightweight.
	2. Add it in the config in game.js.

	Putting objects in a group.
	this.powerUps = this.physics.add.group();
	Since, we are using physics on power-ups, we can set their velocity instead of just changing
	the position value as we did with the ships.

	Adding boundaries to avoid escape of objects:
	powerUp.setCollideWorldBounds(true); // We are telling objects to collide with the boundaries of world.

	Bouncing objects:
	powerUp.setBounce(1);

	Controlling Ship using Keyboard:
	1. Following function is used to get input from the keyboard,
	input.keyboard.createCursorKeys();
	2. We will create a variable to listen for keyboard events and process them.
	3. Now, we call poll this variable in the Game Loop to see what key was pressed.
	4. We will make a new function that will control player's ship and call it in update().
	5. To Fire, we will listen to JustDown event, i.e. when a key (here spacebar) is just pressed down,
	   Phaser.Input.Keyboard.JustDown(this.spacebar)


	Firing Beams:
	1. We will create a custom class for beams which will extend Phaser.GameObjects.Sprite class.
	2. In this way we will create a new instance of Beam every time spacebar is pressed.
	3. We have added an update() method in Beam class to destroy the Beam instance once it gets out of the screen.
	4. But for performance reasons, Phaser won't run update() of objects automatically. It only runs Scene 
	   updates automatically.
	5. So we will have to call update() for each beam in main update() inside Scene2.
	6. So we will create a group to hold all instances of the Beam class. 


	Making objects Collide with each other:
	1. We want ship's beam to destroy enemy ship when it collides with them.
	2. Phaser can calculate when a game object collides or overlaps with another.
	3. We will add collision from beam and powerUps.
	4. We already have separate groups for both, so follwing line will to the work,
	   this.physics.add.collider(this.projectiles, this.powerUps);
	5. Now both objects will bounce when they collide. But shot is also bouncing down on collision.
	6. We will destroy the shot when it collides. This can be done by passing in an anonymous function as third parameter
	   in collider defined in point 4.


	Picking Up PowerUp when player touches it.
	1. We will use overlap instead of collider, because we do want bouncing objects.
	this.physics.add.overlap(this.player, this.powerUp, this.pickPowerUp, null, this);
	Parameters:
		this.player and this.powerUps are objects checked for overlap.
		this.pickPowerUp is the callback function.
		null and this are for the scope of the function.
	2. overlap function only calculates when two objects are overlapping but does not simulate it's physics.


	Making Score Label:
	1. We will user Bitmap Font, which is a spritesheet containing font symbols in a png file.
	2. We will also need a XML file that defines what part of image corresponds to each symbol.
	3. We can create our own Bitmap Font files using web app called Littera. https://www.youtube.com/redirect?event=video_description&v=a17P2A4Bgko&q=http%3A%2F%2Fkvazars.com%2Flittera%2F&redir_token=QUFFLUhqbkkxTWtDQXZUdHZEMUl0YTdidmE5QjhvZnBhQXxBQ3Jtc0tuY2VHaTFJd090N3dnNVZwOUczeWZwd2dqRUpGTk5XRWEzTW1SMjA5bDNlWUxWM2JySUN6eVBiU1JFZ3R4aS1RbEZ4V0ZkYzNNeV9ybC0zdzRNNFFCOWcyMWJVLWRrSU9UTDZZRkltaWpXckRRUjNMbw%3D%3D
	4. Load Bitmap font files in preload() function of Scene1.
	5. Add scorelabel in create() of Scene2

	
	Adding Feedback to game i.e. a way to notify players that somthing happened:
	1. We will add this when a ship is destroyed.
	2. Make a new file explosion.js,add it to index.html file.
	3. Modify hitEnemy() function.

	Parallax Scrolling:
	1. In this background image moves slower than foreground thus creates sense of depth in 2D.
	2. To do this in Phaser 3, first we upload an image and add it as tileSprite
	this.bg_1 = this.add.tileSprite(0, 0, config.width, config.height, "bg_1");
	this.bg_1.setOrigin(0, 0);
	this.bg_1.setScrollFactor(0); // Fixing position to prevent form moving.
*/