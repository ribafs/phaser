class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
  }

  preload() {
    this.load.image("sprTile", "content/sprTile.png");

    this.load.audio("sndEat", "content/sndEat.wav");
    this.load.audio("sndHit", "content/sndHit.wav");
  }

  generateWalls() {
    for (var x = 0; x < this.mapWidth; x++) {
      for (var y = 0; y < this.mapHeight; y++) {

        if (x == 0 || y == 0 ||
            x == this.mapWidth - 1 || y == this.mapHeight - 1) {
          var wall = new Wall(this, x * this.tileSize, y * this.tileSize, 0x888888);
          this.walls.add(wall);
        }
      }
    }
  }

  addFood() {
    var food = new Food(
      this,
      Phaser.Math.Between(1, this.mapWidth - 2) * this.tileSize,
      Phaser.Math.Between(1, this.mapHeight - 2) * this.tileSize
    );
    this.food.add(food);
  }

  addSegment() {

    var lastChild = this.playerSegments.getChildren()[this.playerSegments.getChildren().length - 1];

    var color = this.getHeadSegment().getData("color");
    if (this.playerSegments.getChildren().length % 2 == 0) {
      color = 0x8c6130;
    }

    var segment = new BodySegment(
      this,
      lastChild.x,
      lastChild.y,
      color
    );
    this.playerSegments.add(segment);
  }

  getHeadSegment() { 
    var segment = null;
    for (var i = 0; i < this.playerSegments.getChildren().length; i++) {
      var head = this.playerSegments.getChildren()[i];
      if (head.getData("segmentType") == "HEAD") {
        segment = head;
      }
    }
    return segment;
  }

  setGameOver() {
    if (!this.isGameOver) {
      this.sfx.hit.play();

      this.textGameOver = this.add.text(
        this.game.config.width * 0.5,
        64,
        "GAME OVER",
        {
          fontFamily: "monospace",
          fontSize: 72,
          align: "center"
        }
      );
      this.textGameOver.setOrigin(0.5);

      this.time.addEvent({
        delay: 30,
        callback: function() {
          var lastSegmentIndex = this.playerSegments.getChildren().length - 1;
          
          if (lastSegmentIndex > 0) {
            var lastSegment = this.playerSegments.getChildren()[lastSegmentIndex];

            if (lastSegment) {
              lastSegment.destroy();
            }
          }
        },
        callbackScope: this,
        loop: true
      });

      this.time.addEvent({
        delay: 3000,
        callback: function() {
          this.scene.start("SceneMain");
        },
        callbackScope: this,
        loop: false
      });

      this.isGameOver = true;
    }
  }

  updateSegments() {

    for (var i = this.playerSegments.getChildren().length - 1; i > 0; i--) {
      var segment = this.playerSegments.getChildren()[i];

      var segmentInFront = this.playerSegments.getChildren()[i - 1];

      segment.setData("lastPosition", new Phaser.Math.Vector2(segment.x, segment.y));

      segment.setPosition(segmentInFront.x, segmentInFront.y);
    }

    // collisions
    if (this.playerSegments.getChildren().length > 2) {
      var head = this.getHeadSegment();

      var headRect = new Phaser.Geom.Rectangle(
        head.x + 2,
        head.y + 2,
        head.displayWidth - 4,
        head.displayHeight - 4
      );

      for (var i = 0; i < this.playerSegments.getChildren().length; i++) {
        if (
          i > 1 &&
          this.playerSegments.getChildren()[i].getData("segmentType") == "BODY"
          ) {
          var body = this.playerSegments.getChildren()[i];

          var bodyRect = new Phaser.Geom.Rectangle(
            body.x,
            body.y,
            body.displayWidth,
            body.displayHeight
          );

          if (Phaser.Geom.Intersects.RectangleToRectangle(
            headRect,
            bodyRect
          )) {
            this.setGameOver();
          }
        }
      }
    }
  }
  
  create() {

    this.sfx = {
      eat: this.sound.add("sndEat"),
      hit: this.sound.add("sndHit")
    };

    this.isGameOver = false;
    
    this.tileSize = 16;

    this.mapWidth = Math.ceil(this.game.config.width / this.tileSize);
    this.mapHeight = Math.ceil(this.game.config.height / this.tileSize);

    this.playerSegments = this.add.group();
    this.walls = this.add.group();
    this.food = this.add.group();

    this.addFood();

    this.generateWalls();

    var playerHead = new HeadSegment(
      this,
      Math.round((this.game.config.width / this.tileSize) * 0.5) * this.tileSize,
      Math.round((this.game.config.height / this.tileSize) * 0.5) * this.tileSize,
      0xbf8543
    );
    this.playerSegments.add(playerHead);

    this.addSegment();

    this.input.keyboard.on("keydown_W", function() {
      if (playerHead.getData("direction") !== "DOWN") {
        playerHead.setDirection("UP");
      }
    }, this);

    this.input.keyboard.on("keydown_S", function() {
      if (playerHead.getData("direction") !== "UP") {
        playerHead.setDirection("DOWN");
      }
    }, this);

    this.input.keyboard.on("keydown_A", function() {
      if (playerHead.getData("direction") !== "RIGHT") {
        playerHead.setDirection("LEFT");
      }
    }, this);

    this.input.keyboard.on("keydown_D", function() {
      if (playerHead.getData("direction") !== "LEFT") {
        playerHead.setDirection("RIGHT");
      }
    }, this);

    this.physics.add.overlap(this.playerSegments, this.walls, function(segment, wall) {
      this.setGameOver();
    }, null, this);

    this.physics.add.overlap(this.playerSegments, this.food, function(segment, food) {
      if (food) {

        this.sfx.eat.play();

        this.addSegment();

        this.addFood();

        food.destroy();
      }
    }, null, this);
  }
}