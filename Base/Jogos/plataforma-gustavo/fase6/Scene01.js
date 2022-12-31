class Scene01 extends Phaser.Scene {
    constructor(){
        super ('Scene01')
    }

    preload(){
        this.load.image('sky', '../assets/images/sky.png')
        this.load.image('platform', '../assets/images/platform.png')
        this.load.spritesheet('player', '../assets/sprites/player.png', {frameWidth: 32, frameheight: 32})
    }

    create(){
        this.sky = this.add.image(0,0, 'sky').setOrigin(0,0) // Valor de 0 a 1 e 0,0 é similar a 0
        this.sky.displayWidth = 1000
        this.sky.displayHeight = 600

        this.player = this.physics.add.sprite(50,450, 'player') // x = 50 e y = 60
    		.setCollideWorldBounds(true) // Colidir com os limites do jogo/cena
            .setScale(2,2) // ou apenas 2
            .setBounce(0.4) // quicar. Quando cai o chão o rebate um pouco

        this.player.canJump = true

        // Criar uma animação
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 3
            }),
            frameRate: 8, // velocidade
            repeat: -1 // indefinidamente, enquanto o jogador estiver em movimento
        })

        // Criar variável control
        this.control = this.input.keyboard.createCursorKeys() // Controla setas do teclado
        // console.log(this.control)

        // Criar um grupo para as plataformas
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(0,550, 'platform')
            .setScale(2.5,1)
            .setOrigin(0,1)
            .refreshBody() // Sempre que alterarmos um objeto estático precisamos usar o refresh

        // Adicionar outras plataformas
        this.platforms.create(200,200, 'platform')
        this.platforms.create(1100,200, 'platform')
        this.platforms.create(1100,475, 'platform')
        this.platforms.create(600,400, 'platform')
        .setScale(0.75,1) // 1 é o valor default

        // Adicionar colisor
        this.physics.add.collider(this.player, this.platforms)

        // Setar dimensões do mundo/cena
        this.physics.world.setBounds(0,0,1000,600) // dois pontos: 0,0 do canto superior esquerdo e 1000,600 do inferior direito fora da tela

        // Criar câmera e que a mesma siga o personagem
        this.cameras.main.startFollow(this.player).setBounds(0,0,1000,600)        
    }

    update(){
        if(this.control.left.isDown){
            this.player.flipX = true // Girar o personagem ao in vés de criar uma outra animação
            this.player.anims.play('walk', true)// Usar a animação criada
            this.player.setVelocityX(-150)
        }else if(this.control.right.isDown){
            this.player.flipX = false
            this.player.anims.play('walk', true) // true assegura que a animação seja executada mesmo que outro evento esteja acontecendo com o objeto
            this.player.setVelocityX(150)
        }else{
            this.player.setVelocityX(0).setFrame(0)
        }

        if(!this.player.body.touching.down){
            this.player.setFrame(
                this.player.body.velocity.y < 0 ? 1 : 3 // Se < 0 use o frame 1, senão use o 3. Ao invés de criar uma outra animação
            )
        }

        if(this.control.up.isDown && this.player.canJump && this.player.body.touching.down){
            this.player.setVelocityY(-500)
            this.canJump = false
        }
        if(!this.control.up.isDown && !this.player.canJump && this.player.body.touching.down){
            this.canJump = true
        }

    }
}
