class Scene01 extends Phaser.Scene {
    constructor(){
        super ('Scene01')
    }

    preload(){
        this.load.image('sky', '../assets/images/sky.png')
        this.load.spritesheet('player', '../assets/sprites/player.png', {frameWidth: 32, frameheight: 32})
    }

    create(){
        this.sky = this.add.image(0,0, 'sky').setOrigin(0,0) // Valor de 0 a 1 e 0,0 é similar a 0
        this.sky.displayWidth = 800
        this.sky.displayHeight = 600

        this.player = this.physics.add.sprite(50,450, 'player') // x = 50 e y = 60
    		.setCollideWorldBounds(true) // Colidir com os limites do jogo/cena
            .setScale(2,2) // ou apenas 2

        this.player.canJump = true

        // Criar variável control
        this.control = this.input.keyboard.createCursorKeys() // Controla setas do teclado
        // console.log(this.control)

        
    }

    update(){
        if(this.control.left.isDown){
            this.player.setVelocityX(-150)
        }else if(this.control.right.isDown){
            this.player.setVelocityX(150)
        }else{
            this.player.setVelocityX(0)
        }
        if(this.control.up.isDown && this.player.canJump){
            this.player.setVelocityY(-500)
            this.canJump = false
        }
        if(!this.control.up.isDown && !this.player.canJump){
            this.canJump = true
        }

    }
}
