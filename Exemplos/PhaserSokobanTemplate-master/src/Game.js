import Phaser from 'phaser';
import PlayScene from './scenes';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: PlayScene,
});
export default game;
