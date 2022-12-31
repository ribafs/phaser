import Phaser from 'phaser';
import { DURATION } from '../utils/constants';

// Base class from which Players, Crate, and other entities inherit
export default class Entity extends Phaser.GameObjects.Sprite {
  // Configure the sprite, set the entity's tile, and set its origin to zero
  constructor(scene, x, y, tile, name) {
    super(scene, x, y, name);
    this.tile = tile;
    this.setOrigin(0);
  }

  // Perform an animation to move to the given tile
  moveTo(tile) {
    this.tile = tile;
    this.scene.tweens.add({
      targets: this,
      x: tile.pixelX,
      y: tile.pixelY,
      duration: DURATION,
      ease: Phaser.Math.Easing.Quartic.Out,
    });
  }

  // Return whether the moving animation is active
  get isMoving() {
    return this.scene.tweens.isTweening(this);
  }
}
