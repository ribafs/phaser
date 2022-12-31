//Global Variables
//The Scenes + this file
var fromInit = true;

var level;

var levels = new Map();

levels.set("Tails",new Level("Tails", 150));
levels.set("Knuckles",new Level("Knuckles", 300));
levels.set("First Metal Sonic",new Level("First Metal Sonic", 1000));
levels.set("Final Metal Sonic",new Level("Final Metal Sonic", 350));

var music;

function manageMusic(musicName)
{
    music.stop();
    music = Init.sound.add(musicName);
    music.play();
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
        Init,
        World,
        Action/*,
        LastLevel*/
    ]
};
var game = new Phaser.Game(config);




