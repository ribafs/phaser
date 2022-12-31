class Scene01 extends Phaser.Scene {
    constructor(){
        super ('Scene01')
    }

    preload(){
        this.load.image('sky', '../assets/images/sky.png')
        this.load.image('platform', '../assets/images/platform.png')
        this.load.spritesheet('player', '../assets/sprites/player.png', {frameWidth: 32, frameheight: 32})
        this.load.spritesheet('coin', '../assets/sprites/coin.png', {frameWidth: 32, frameheight: 32})
    }

    create(){
        this.sky = this.add.image(0,0, 'sky').setOrigin(0,0) // Configura o ponto de origem de um objeto. Valor de 0 a 1 e 0,0 é similar a 0
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

        // Criar um grupo para as plataformas estáticas
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

        // Criar um grupo de plataformas dinâmicas
        this.dinPlatforms = this.physics.add.group({
            allowGravity: false,
            immovable: true
        })

        // criar uma variável e atribuir uma plataforma a ela
        let dinPlatform = this.dinPlatforms.create(150,420, 'platform').setScale(0.25,1) // Reduzir a largura e deixar a altura como está

        // Deixar a plataforma se movendo entre dois pontos
        dinPlatform.speed = 2
        dinPlatform.minX = 150
        dinPlatform.maxX = 300

        dinPlatform = this.dinPlatforms.create(500,280, 'platform').setScale(0.25,1) // Reduzir a largura e deixar a altura como está

        // Deixar a plataforma se movendo entre dois pontos
        dinPlatform.speed = 1
        dinPlatform.minX = 500
        dinPlatform.maxX = 800

        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 14,
            setXY: {
                x: 12,
                y: -50,
                stepX: 70 // Espaçamento no eixo X entre cada moeda
            }
        })

        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('coin', {
                start: 0,
                end: 4
            }),
            frameRate: 8,
            repeat: -1
        })

        this.coins.children.iterate((c) => {
            c.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
            c.anims.play('spin')
        })

        // Adicionar colisor
        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.dinPlatforms, this.platformMovingThings)
        this.physics.add.collider(this.coins, this.platforms)
        this.physics.add.collider(this.coins, this.dinPlatforms, this.platformMovingThings)

        // Criar um overlap entre dois objetos, para que convivam no mesmo espaço
        this.physics.add.overlap(this.player, this.coins, this.collectCoin)

        // Setar dimensões do mundo/cena
        this.physics.world.setBounds(0,0,1000,600) // dois pontos: 0,0 do canto superior esquerdo e 1000,600 do inferior direito fora da tela

        // Criar câmera e que a mesma siga o personagem
        this.cameras.main.startFollow(this.player).setBounds(0,0,1000,600)        
    }

    collectCoin(p, coin){
        coin.destroy()
    }

    movePlatform(platf){
        if(platf.x < platf.minX || platf.x > platf.maxX){
            platf.speed *= -1
        }
        platf.x += platf.speed
    }

    platformMovingThings(sprite, plat){
        sprite.x += plat.speed
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

        this.dinPlatforms.children.iterate((plat) => {
            this.movePlatform(plat)
        })

    }
}
