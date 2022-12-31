var BootState = {
    //scaling options
    init: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1000; //yer çekimi


        //Camera ayarlama
        this.game.world.setBounds(0, 0, 360, 700);
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