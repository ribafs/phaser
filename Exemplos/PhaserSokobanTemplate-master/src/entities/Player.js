import Entity from './Entity';

export default class Player extends Entity {
  constructor(scene, x, y, tile) {
    super(scene, x, y, tile, 'player');
  }
}
