var Init = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function Init() {
            Phaser.Scene.call(this, { key: 'Init' });
        },

    preload: function () {
        this.load.image('titre', 'ressources/images/titre.jpg');

        this.load.image('boutonTestAnim', 'ressources/images/boutonTestAnimation.png');

        this.load.image('noir', 'ressources/images/noir.png');

        this.load.image('sonic', 'ressources/images/sonicIcon.png');
        this.load.image('sonicSpin', 'ressources/images/sonicSpin.jpg');

        this.load.image('tails', 'ressources/images/tailsIcon.png');
        this.load.image('knuckles', 'ressources/images/knucklesIcon.png');

        this.load.image('thumbUpTails', 'ressources/images/tailsThumbUp.png');
        this.load.image('thumbUpKnuckles', 'ressources/images/knucklesThumbUp.png');

        this.load.image('fondWorld', 'ressources/images/fondWorld.jpg');
        this.load.image('fondTails', 'ressources/images/tailsWorking.jpg');
        this.load.image('fondKnuckles', 'ressources/images/masterEmerald.png');

        this.load.audio('spinPrepare', 'ressources/sons/spinPrepare.ogg');
        this.load.audio('spinDash', 'ressources/sons/spinDash.ogg');
        this.load.audio('worldMenu', 'ressources/sons/worldMenu.ogg');
        this.load.audio('puzzles', 'ressources/sons/puzzles.ogg');
        this.load.audio('endGame', 'ressources/sons/endGame.mp3');
    },

    create: function () {
        Init = this.scene.get("Init");
        music = this.sound.add('worldMenu');
        manageMusic('worldMenu');
        this.initBackground = this.add.sprite(0, 0, 'titre').setOrigin(0, 0).setInteractive();
        this.initBackground.on('pointerdown', function (pointer) {
            Init.scene.start('World');
        });
    }
});