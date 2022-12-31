var PreloadState = {
    //load the game assets before the game starts
    preload: function() {

        //Game Logo

        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5);

        //Progress Bar
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar); //progress bar

        this.load.image('ground', 'assets/img/ground.png');
        this.load.image('platform', 'assets/img/platform.png');
        this.load.image('goal', 'assets/img/gorilla.png');
        this.load.image('barrel', 'assets/img/barrel.png');
        this.load.image('arrowButton', 'assets/img/arrowButton.png');

        //https://phaser.io/docs/2.6.2/Phaser.Loader.html#spritesheet
        this.load.spritesheet('player', 'assets/img/player_spritesheet.png', 28, 30, 5, 1, 1);
        this.load.spritesheet('fire', 'assets/img/fire_spritesheet.png', 20, 21, 2, 1, 1);

        //import json file
        this.load.text('level', 'assets/data/level.json');



    },
    create: function() {
        this.state.start('HomeState');
    }
}