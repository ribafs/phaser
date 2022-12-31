var gameModule = (function(){
	var config = {
		type: Phaser.AUTO,
		width: 1050,
		height: 732,
		scene: {
			init: init,
			preload: preload,
			create: create,
			update: update
		},
		physics: {
			default: 'arcade',
			arcade: {
				debug: true
			}
		}
	};

	var game = new Phaser.Game(config);

	var player;
	var dir = 'down';
	var walls;
	var cursors;
	var animFrame;
	var keys = {};
	var press = false;

	function init() {

	}

	function preload() {
		cursors = this.input.keyboard.createCursorKeys();
		this.load.image('bg', 'img/locations/bedroomAsriel.png');
		this.load.spritesheet('player', 'img/character/spritesheet_asriel.png', {frameWidth: 64, frameHeight: 112});
		this.load.image('wall', 'img/misc/wall.png');
	}

	function create(){
		//var textTest = '* Asriel, you know you aren\'t allowed to go down there.';
		//var dialogText = this.add.text(50, 50, textTest, {fontFamily:'UndertaleFont', backgroundColor: 'black', color:'white', fontSize:24});
		//dialogText.depth=1;

		this.anims.create({
			key: 'walkLeft',
			frames: this.anims.generateFrameNumbers('player', {start:0, end:1}),
			frameRate: 5,
			repeat: -1
		});
		this.anims.create({
			key: 'talkLeft',
			frames: this.anims.generateFrameNumbers('player', {start:2, end:3}),
			frameRate: 5,
			repeat: -1
		});
		this.anims.create({
			key: 'walkDown',
			frames: this.anims.generateFrameNumbers('player', {start:4, end:7}),
			frameRate: 5,
			repeat: -1
		});
		this.anims.create({
			key: 'talkDown',
			frames: this.anims.generateFrameNumbers('player', {start:8, end:9}),
			frameRate: 5,
			repeat: -1
		});
		this.anims.create({
			key: 'walkUp',
			frames: this.anims.generateFrameNumbers('player', {start:10, end:13}),
			frameRate: 5,
			repeat: -1
		});
		var bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
		bg.displayWidth = this.sys.canvas.width;
		bg.displayHeight = this.sys.canvas.height;

		player = this.physics.add.sprite(465, 425, 'player');
		player.body.collideWorldBounds = true;
		player.setSize(56,48).setOffset(4,64);
		player.setFrame(4);

		walls = this.physics.add.staticGroup();
		walls.create(100,250,'wall').setAlpha(0).setSize(5,430);
		walls.create(105,230,'wall').setAlpha(0).setSize(92,55);
		walls.create(100,673,'wall').setAlpha(0).setSize(623,70);
		//console.log();
		//console.log(walls.getChildren());
		this.physics.add.collider(player, walls, stopWallAnim, null, this);//function on collision
		//this.physics.add.overlap(player, walls);//function on overlap
	}

	function update() {
		//console.log(player.anims.getCurrentKey());

		if (cursors.left.isDown) {
			if (press == false) {
				dir = 'left';
				press = true;
			}
			player.setVelocityX(-150);
		} else if (cursors.right.isDown) {
			if (press == false) {
				press = true;
				dir = 'right';
			}
			player.setVelocityX(150);
		} else {
			player.setVelocityX(0);
		}

		if (cursors.up.isDown) {
			if (press == false) {
				press = true;
				dir = 'up';
			}
			player.setVelocityY(-150);
		} else if (cursors.down.isDown) {
			if (press == false) {
				press = true;
				dir = 'down';
			}
			player.setVelocityY(150);
		} else {
			player.setVelocityY(0);
		}
		animate();
		
		this.input.keyboard.on('keydown_Z', function() {
			//
		});



		this.input.keyboard.on('keydown', function(event) {
			//console.log(cursors);
		});

		this.input.keyboard.on('keyup', function(event) {
			if (dir == 'left') {
				player.setFrame(0);
				player.flipX = false;
				press = false;
			} else if (dir == 'right') {
				player.setFrame(0);
				player.flipX = true;
				press = false;
			} else if (dir == 'up') {
				player.setFrame(10);
				press = false;
			} else if (dir == 'down') {
				player.setFrame(4);
				press = false;
			}
			//console.log(keys);
		});
	}

	var stopWallAnim = function() {
		if (dir == 'left' && (cursors.up.isUp && cursors.down.isUp)) {
			player.anims.stop();
			player.setFrame(0);
			player.flipX = false;
		} else if (dir == 'right' && (cursors.up.isUp && cursors.down.isUp)) {
			player.anims.stop();
			player.setFrame(0);
			player.flipX = true;
		} else if (dir == 'up' && (cursors.left.isUp && cursors.right.isUp)) {
			player.anims.stop();
			player.setFrame(10);
		} else if (dir == 'down' && (cursors.left.isUp && cursors.right.isUp)) {
			player.anims.stop();
			player.setFrame(4);
		}
		press = false;
	};

	function animate() {
		if (dir == 'left' && cursors.left.isDown) {
			player.anims.play('walkLeft', true);
    		player.flipX = false;
		} else if (dir == 'right' && cursors.right.isDown) {
			player.anims.play('walkLeft', true);
			player.flipX = true;
		} else if (dir == 'up' && cursors.up.isDown) {
			player.anims.play('walkUp', true);
		} else if (dir == 'down' && cursors.down.isDown) {
			player.anims.play('walkDown', true);
		} else {
			player.anims.stop();
		}
	}

})();

/*
depth = 'z-index' || bringToTop || setDepth
GameObject.setInteractive() ????
https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13
https://photonstorm.github.io/phaser3-docs/index.html
*/