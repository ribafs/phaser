import Phaser from 'phaser';

import { Player, Crate } from '../entities';
import { DURATION, DIRECTIONS, MAX_LEVEL } from '../utils/constants';
import { filterTilesByExistence, getNextTile } from '../utils/helpers';

// The scene which is used to load every level and allow interaction with the game
export default class PlayScene extends Phaser.Scene {
  // Initialization of the scene, which happens on startup and restart of level
  init(data) {
    // The index of the current level to load
    this.level = data.level || 1;

    // The status of whether the level has been completed or not
    this.victory = false;

    // A stack to hold the states of movement, in order to undo
    this.undoStack = [];
  }

  // Loading of all assets needed for the scene
  preload() {
    this.load.tilemapTiledJSON(`level-${this.level}`, `assets/levels/level-${this.level}.json`);
    this.load.image('sokoban', 'assets/tilesheets/sokoban.png');
    this.load.image('crate', 'assets/sprites/crate.png');
    this.load.image('player', 'assets/sprites/player.png');
  }

  // Creation of all components needed for operation of the scene
  create() {
    // The arrow keys to be used for movement
    this.cursors = this.input.keyboard.createCursorKeys();

    // The tilemap loaded from the Tiled level layout file, and its tileset images
    this.tileMap = this.make.tilemap({ key: `level-${this.level}` });
    this.tileSet = this.tileMap.addTilesetImage('sokoban', 'sokoban', 128, 128);

    // Initialization of the level itself
    this.createLevel();

    // Progressing the level on any keydown after the level is complete
    this.input.keyboard.on('keydown', () => {
      // The new level to load will be the next level index, or looped back to 1 if past MAX_LEVEL
      if (this.victory) this.scene.restart({ level: this.level >= MAX_LEVEL ? 1 : this.level + 1 });
    });
  }

  // Operation of the scene, which runs every frame
  update() {
    // Restarting the level on space bar
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) this.scene.restart({ level: this.level });

    // Preventing any steps from being performed if the level is complete, or the player move animation is active
    if (this.victory || this.player.isMoving) return;

    // On pressing Z, undo the last movement
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z), DURATION)) {
      this.undo();
    }

    // On pressing one of the arrow keys, trigger a movement in the corresponding direction
    if (this.input.keyboard.checkDown(this.cursors.up, DURATION)) this.moveEntities(DIRECTIONS.NORTH);
    if (this.input.keyboard.checkDown(this.cursors.down, DURATION)) this.moveEntities(DIRECTIONS.SOUTH);
    if (this.input.keyboard.checkDown(this.cursors.left, DURATION)) this.moveEntities(DIRECTIONS.WEST);
    if (this.input.keyboard.checkDown(this.cursors.right, DURATION)) this.moveEntities(DIRECTIONS.EAST);
  }

  // Undo the game to its previous state
  undo() {
    // Pop the previous state off the stack
    const previousState = this.undoStack.pop();

    // If there is no previous state, then there is nothing to undo
    if (!previousState) return;

    // Move the player and the crates to their positions in the previous state
    this.player.moveTo(previousState.playerTile);
    this.crates.forEach((c, i) => c.moveTo(previousState.crateTiles[i]));
  }

  // Save the current state to the stack to allow for future undo
  saveState() {
    this.undoStack.push({ playerTile: this.player.tile, crateTiles: this.crates.map((c) => c.tile) });
  }

  // Move all entities in the correct direction
  moveEntities(direction) {
    // Retrieve the adjacent floor tile, and stop movement if it doesn't exist
    const nextFloorTile = getNextTile(this.player.tile, direction, this.floorLayer);
    if (!nextFloorTile) return;

    // Retrieve the adjacent wall tile, and stop movement if it does exist
    const nextWallTile = getNextTile(this.player.tile, direction, this.wallLayer);
    if (nextWallTile) return;

    // Retrieve the adjacent crate tile
    const nextCrate = this.getCrateByTile(nextFloorTile);

    // If the adjacent crate tile exists, check if that needs to move or if movement has to stop
    if (nextCrate) {
      // Retrieve the following floor tile, and stop movement if it doesn't exist
      const beyondFloorTile = getNextTile(nextFloorTile, direction, this.floorLayer);
      if (!beyondFloorTile) return;

      // Retrieve the following wall tile, and stop movement if it does exist
      const beyondWallTile = getNextTile(nextFloorTile, direction, this.wallLayer);
      if (beyondWallTile) return;

      // Retrieve the following crate, and stop movement if it does exist
      const beyondCrateTile = this.getCrateByTile(beyondFloorTile);
      if (beyondCrateTile) return;

      // Save the current state, and move the crate to the following floor tile
      this.saveState();
      nextCrate.moveTo(beyondFloorTile);
    } else {
      // Since there is no adjacent crate, save the current state
      this.saveState();
    }

    // Move the player to to adjacent floor tile and check if the level is complete
    this.player.moveTo(nextFloorTile);
    this.checkVictory();
  }

  // Given a tile, return the crate at this tile if it exists
  getCrateByTile(tile) {
    return this.crates.find((c) => c.tile.x === tile.x && c.tile.y === tile.y);
  }

  // Given a layer, return all tiles on this layer that exist
  getTilesByLayer(layer, test = filterTilesByExistence) {
    this.tileMap.setLayer(layer);
    return this.tileMap.filterTiles((tile) => test(tile), this, 0, 0, this.tileMap.width, this.tileMap.height);
  }

  // Check if the level is complete, and set victory status accordingly
  checkVictory() {
    // The level is complete if the player is on the goal and all crates are on their goals
    const playerOnGoal = this.player.tile.x === this.goalTile.x && this.player.tile.y === this.goalTile.y;
    const cratesOnGoals = this.crateGoalTiles.every((tile) => this.getCrateByTile(tile));
    this.victory = playerOnGoal && cratesOnGoals;
  }

  // Create all entities, layers, and tiles for the level
  createLevel() {
    this.createLayers();
    this.createAllGoalTiles();
    this.createPlayer();
    this.createCrates();
    this.centerCamera();
  }

  // Create all layers from the Tiled tilemap
  createLayers() {
    const x = 0;
    const y = 0;

    // Create the player and crate layers, but set them to invisible since we don't the layers to render
    this.spawnLayer = this.tileMap.createLayer('Spawn', this.tileSet, x, y);
    this.spawnLayer.setVisible(false);
    this.crateLayer = this.tileMap.createLayer('Crates', this.tileSet, x, y);
    this.crateLayer.setVisible(false);

    // Create the remaining layers, and let them be rendered
    this.floorLayer = this.tileMap.createLayer('Floor', this.tileSet, x, y);
    this.wallLayer = this.tileMap.createLayer('Walls', this.tileSet, x, y);
    this.crateGoalLayer = this.tileMap.createLayer('CrateGoals', this.tileSet, x, y);
    this.goalLayer = this.tileMap.createLayer('Goal', this.tileSet, x, y);
  }

  // Create all goals, for player and crates
  createAllGoalTiles() {
    this.createGoalTile();
    this.createCrateGoalTiles();
  }

  // Create the player goal tile, and throw an error if there is not exactly one goal
  createGoalTile() {
    const goals = this.getTilesByLayer(this.goalLayer);
    if (!goals) throw new Error('There is no goal location.');
    if (goals.length !== 1) throw new Error(' There is not exactly one goal location.');
    [this.goalTile] = goals;
  }

  // Create the crate goal tiles
  createCrateGoalTiles() {
    this.crateGoalTiles = this.getTilesByLayer(this.crateGoalLayer);
  }

  // Create the player entity, and add it to the world
  createPlayer() {
    this.createSpawnTile();
    const { x, y } = this.tileMap.tileToWorldXY(this.spawnTile.x, this.spawnTile.y);
    this.player = new Player(this, x, y, this.spawnTile);
    this.add.existing(this.player);
  }

  // Create the tile to add to the player entity, and throw an error if there is not exactly one spawn
  createSpawnTile() {
    const spawns = this.getTilesByLayer(this.spawnLayer);
    if (!spawns) throw new Error('There is no spawn location.');
    if (spawns.length !== 1) throw new Error(' There is not exactly one spawn location.');
    [this.spawnTile] = spawns;
  }

  // Create the crate entities, and associated them with tiles on their layer
  createCrates() {
    this.crates = this.getTilesByLayer(this.crateLayer).map((tile) => {
      const { x, y } = this.tileMap.tileToWorldXY(tile.x, tile.y);
      const crate = new Crate(this, x, y, tile);
      this.add.existing(crate);
      return crate;
    });
  }

  // Perform camera configuration to center the game on the screen
  centerCamera() {
    const x = window.innerWidth / 2 - this.tileMap.widthInPixels / 2;
    const y = window.innerHeight / 2 - this.tileMap.heightInPixels / 2;
    this.cameras.remove(this.cameras.main);
    const camera = this.cameras.add(x, y, this.tileMap.widthInPixels, this.tileMap.heightInPixels, true);
    camera.setOrigin(0, 0);
    camera.setScroll(0, 0);
  }
}
