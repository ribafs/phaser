class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
  }
}

class Wall extends Entity {
  constructor(scene, x, y, color) {
    super(scene, x, y, "sprTile");
    this.body.setImmovable(true);
    this.setTint(color);
    this.setOrigin(0);
  }
}

class Food extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprTile");
    this.body.setImmovable(true);
    this.setOrigin(0);
    this.setTint(0xff0000);
  }
}

class HeadSegment extends Entity {
  constructor(scene, x, y, color) {
    super(scene, x, y, "sprTile");
    this.scene = scene;
    this.body.setImmovable(true);
    this.setTint(color);
    this.setOrigin(0);

    this.setData("color", color);
    this.setData("moveIncrement", this.scene.tileSize);
    this.setData("direction", "none");
    this.setData("segmentType", "HEAD");

    this.moveTimer = this.scene.time.addEvent({
      delay: 100,
      callback: function() {

        switch (this.getData("direction")) {
          case "UP": {
            this.moveUp();
            break;
          }

          case "DOWN": {
            this.moveDown();
            break;
          }

          case "LEFT": {
            this.moveLeft();
            break;
          }

          case "RIGHT": {
            this.moveRight();
            break;
          }
        }

        this.scene.updateSegments();
      },
      callbackScope: this,
      loop: true
    });
  }

  setDirection(direction) {
    this.setData("direction", direction);
  }

  moveUp() {
    this.y -= this.getData("moveIncrement");
  }

  moveDown() {
    this.y += this.getData("moveIncrement");
  }

  moveLeft() {
    this.x -= this.getData("moveIncrement");
  }

  moveRight() {
    this.x += this.getData("moveIncrement");
  }
}

class BodySegment extends Entity {
  constructor(scene, x, y, color) {
    super(scene, x, y, "sprTile");
    this.scene = scene;
    this.body.setImmovable(true);
    this.setTint(color);
    this.setOrigin(0);

    this.setData("color", color);
    this.setData("lastPosition", new Phaser.Math.Vector2(this.x, this.y));
    this.setData("segmentType", "BODY");
  }
}
