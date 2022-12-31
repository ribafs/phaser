# Phaser 3 Sokoban Template

A [Phaser 3](https://phaser.io/phaser3) project template that is a base for a [Sokoban](https://en.wikipedia.org/wiki/Sokoban)-like game. It is intended to be used either to add levels to a functional Sokoban-like game, or to create a custom grid-based puzzle game from this framework and implementation.

## Attribution

This project is based on this [Phaser 3 Webpack Project Template](https://github.com/photonstorm/phaser3-project-template). The art in `assets/sprites` and `assets/tilesheets` was provided for free by [Kenney](https://www.kenney.nl/assets/sokoban). The level files in `assets/levels` were created in the [Tiled](https://www.mapeditor.org/) level editor.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run lint` | Auto-formats code to conform to style standards |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `npm start`.

After starting the development server with `npm start`, you can edit any files in the `src` folder and webpack will automatically recompile and reload your server (available at `http://localhost:8080` by default).

## Creating and Editing Levels

Each level in `assets/levels` has a `level-x.json` and `level-x.tmx` file, where `x` is the number of the level.

The `.tmx` file can be opened (or created) in the Tiled level editor, using `assets/tilesheets/sokoban.png` as the tilesheet. Each level expects the following layers:

| Layer | Description |
|-------|-------------|
| `Crates` | The starting crate positions on the map. The sprites chosen for these are irrelevant, as the crates will be rendered as `assets/sprites/crate.png`. |
| `CrateGoals` | The goal positions for the crates on the map. |
| `Goal` | The goal position for the player on the map. There must be exactly one goal. |
| `Spawn` | The starting player position on the map. There must be exactly one spawn. The sprite chosen for this is irrelevant, as the player will be rendered as `assets/sprites/player.png`. |
| `Walls` | The immovable walls on the map. |
| `Floor` | The flooring on the map. There must be flooring on each tile. |

After editing the level's `.tmx` file, it should be added to `assets/levels`. Additionally, a `.json` file should be exported for this level, and also added to `assets/levels`.

The const `MAX_LEVEL` in `src/utils/constants.js` should be changed to be equal to the number of levels in the game.
