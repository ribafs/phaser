class Preload extends Phaser.Scene{
	constructor(){
		super('Preload')
	}
	
	preload(){
		this.load.audio('sndMusic',['assets/audio/music.ogg'])
		this.load.audio('sndJump',['assets/audio/jump.ogg'])
		this.load.audio('sndGetCoin',['assets/audio/getcoin.ogg'])
	
		this.load.image('end','assets/images/youWin.jpg')
		this.load.image('start','assets/images/start.jpg')
		this.load.image('sky', 'assets/images/sky.png')
		this.load.image('platform', 'assets/images/platform.png')
		this.load.image('enemy', 'assets/images/enemy.png')
		this.load.spritesheet('player', 'assets/sprites/player.png', {frameWidth: 32, frameHeight: 32})
		this.load.spritesheet('coin', 'assets/sprites/coin.png', {frameWidth: 32, frameHeight: 32})
	}
	
	create(){
        // Animação para caminhar
		this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('player', {
				start: 0,
				end: 3
			}),
			frameRate: 8,
			repeat: -1
		})
		
        // Animação para moedas girarem
		this.anims.create({
			key: 'spin',
			frames: this.anims.generateFrameNumbers('coin',{
				start: 0,
				end: 4
			}),
			frameRate: 8,
			repeat: -1
		})
	
        // Chamar a StartScene
		this.scene.start('StartScene')
	}
}
