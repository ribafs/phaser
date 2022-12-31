import { DIRECTIONS } from './constants';

// Return whether the given tile has contents
export const filterTilesByExistence = (tile) => tile.index > -1;

// Get the adjacent tile in the given direction on the given layer
export const getNextTile = (currentTile, direction, layer) => {
  const { x, y } = currentTile;
  switch (direction) {
    case DIRECTIONS.NORTH:
      return layer.getTileAt(x, y - 1);
    case DIRECTIONS.SOUTH:
      return layer.getTileAt(x, y + 1);
    case DIRECTIONS.WEST:
      return layer.getTileAt(x - 1, y);
    case DIRECTIONS.EAST:
      return layer.getTileAt(x + 1, y);
    default:
      throw new Error('Invalid direction provided.');
  }
};
