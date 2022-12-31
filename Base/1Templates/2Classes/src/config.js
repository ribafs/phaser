var config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 600 }
    }
  },
  scene: [
    SceneMain
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true
};

var game = new Phaser.Game(config);
