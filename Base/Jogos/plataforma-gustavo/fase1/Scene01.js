class Scene01 extends Phaser.Scene {
    constructor(){
        super ('Scene01')
    }

    preload(){
        this.load.image('sky', '../assets/images/sky.png')
    }

    create(){
        this.sky = this.add.image(0,0, 'sky').setOrigin(0,0) // Valor de 0 a 1 e 0,0 é similar a 0
        this.sky.displayWidth = 800
        this.sky.displayHeight = 600

    }

    update(){
    }
}
