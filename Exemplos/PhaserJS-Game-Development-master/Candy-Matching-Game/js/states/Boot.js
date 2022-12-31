var Match3 = Match3 || {};

Match3.BootState = {
    init: function() {

        this.game.state.backgroundColor = "#fff";

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;


        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },
    preload: function() {
        //assets we'll use in the loading screen
        this.load.image('bar', 'assets/images/preloader-bar.png');
    },
    create: function() {
        this.state.start('Preload');
    }
}