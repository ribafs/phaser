import Entity from './Entity';

export default class Crate extends Entity {
  constructor(scene, x, y, tile) {
    super(scene, x, y, tile, 'crate');
  }
}
