var BootState = {
    //scaling options
    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },
    preload: function() {
        this.load.image('preloadBar', 'assets/img/bar.png');
        this.load.image('logo', 'assets/img/logo.png');
    },
    create: function() {
        this.game.stage.backgroundColor = '#fff';

        this.state.start('PreloadState');
    }
}