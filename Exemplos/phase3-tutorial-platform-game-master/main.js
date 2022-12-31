var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var cursors;
var platforms;
var player;
var stars;
var score = 0;
var scoreText;
var bombs;
var hp = 100;
var hpText;

const img = {
  sky: 'sky',
  ground: 'ground',
  star: 'star',
  bomb: 'bomb',
  dude: 'dude',
};

const move = {
  left: 'left',
  turn: 'turn',
  right: 'right',
};

function preload() {
  this.load.image(img.sky, 'assets/sky.png');
  this.load.image(img.ground, 'assets/platform.png');
  this.load.image(img.star, 'assets/star.png');
  this.load.image(img.bomb, 'assets/bomb.png');
  this.load.spritesheet(img.dude, 'assets/dude.png', {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create() {
  this.add.image(400, 300, img.sky); // .setOrigin(0, 0);

  // Platform static group
  platforms = this.physics.add.staticGroup();
  platforms
    .create(400, 568, img.ground)
    .setScale(2)
    .refreshBody();
  platforms.create(600, 400, img.ground);
  platforms.create(50, 250, img.ground);
  platforms.create(750, 220, img.ground);

  player = this.physics.add.sprite(100, 450, img.dude);

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: move.left,
    frames: this.anims.generateFrameNumbers(img.dude, { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: move.turn,
    frames: [
      {
        key: img.dude,
        frame: 4,
      },
    ],
  });

  this.anims.create({
    key: move.right,
    frames: this.anims.generateFrameNumbers(img.dude, { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  // Stars group
  stars = this.physics.add.group({
    key: img.star,
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  stars.children.iterate(function(child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
  });

  // Bombs group
  bombs = this.physics.add.group();

  // Colliders
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);
  this.physics.add.overlap(player, bombs, hitBomb, null, this);

  this.physics.add.overlap(player, stars, collectStar, null, this);

  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#000 ',
  });

  hpText = this.add.text(650, 16, 'HP: 100', {
    fontSize: '32px',
    fill: '#000',
  });
}

function hitBomb(player, bomb) {
  if (hp <= 0) {
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play(move.turn);
    gameOver = true;
  } else {
    hp -= 5;
    hpText.setText('HP: ' + hp);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function(child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, img.bomb);
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;

  }
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play(move.left, true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play(move.right, true);
  } else {
    player.setVelocityX(0);
    player.anims.play(move.turn);
  }

  if (cursors.up.isDown) {
    if (player.body.touching.down) {
      console.log('touching down');
      player.setVelocityY(-100);
    } else {
      console.log('air jump');
      player.setVelocityY(-300);
    }
  }
}
