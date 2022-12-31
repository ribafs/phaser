var config = {
  type: Phaser.WEBGL,
  width: 640,
  height: 480,
  background: "black",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 }
    }
  },
  scene: [
    SceneMainMenu,
    SceneMain
  ],
  pixelArt: true,
  roundPixels: true
};

var game = new Phaser.Game(config);

