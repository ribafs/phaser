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


        this.load.image('backyard', 'assets/img/backyard.png');
        this.load.image('apple', 'assets/img/apple.png');
        this.load.image('candy', 'assets/img/candy.png');
        this.load.image('rotate', 'assets/img/rotate.png');
        this.load.image('toy', 'assets/img/rubber_duck.png');
        this.load.image('arrow', 'assets/img/arrow.png');
        //https://phaser.io/docs/2.6.2/Phaser.Loader.html#spritesheet
        this.load.spritesheet('pet', 'assets/img/pet.png', 97, 83, 5, 1, 1);
    },
    create: function() {
        this.state.start('HomeState');
    }
}