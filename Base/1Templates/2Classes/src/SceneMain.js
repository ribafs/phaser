class SceneMain extends Phaser.Scene {

  constructor() {
    super({ key: "SceneMain" });
  }

  preload() {
    this.spritePreload('player', "assets/sprites/player.png", 32, 32)
    this.imagePreload("platform", "assets/images/platform.png");
    this.audioPreload('coin', 'assets/audio/coin.mp3')
  }

  create() {
    this.platform = this.physics.add.staticImage(0, 500, 'platform').setScale(2,1).setOrigin(0,0).refreshBody()

    this.player = this.physics.add.sprite(100, 300, 'player');

    this.animationCreate('walk', 'player', 0, 3, 8, -1)

    this.control = this.input.keyboard.createCursorKeys()

    this.textCreate(50,20, 'Mover com setas <-- e --> ', '32px')

    this.coin = this.audioCreate('coin')

    this.physics.add.collider(this.player, this.platform)
  }

  update() {
			if(this.control.left.isDown){
				this.player.flipX = false
				this.player.anims.play('walk',true)
				this.player.setVelocityX(-150)
        this.coin.play()
			} else if(
        this.control.right.isDown){
				this.player.flipX = true
				this.player.anims.play('walk',true)
				this.player.setVelocityX(150)
        this.coin.play()
			} else {
				this.player.setVelocityX(0).setFrame(0)
			}
  }

  // Métodos customizados

  imagePreload(alias, imagePath){
	  this.load.image(alias, imagePath)
  }

  spritePreload(alias, spritePath, w, h){ // Ex: 'player', 'assets/sprites/player.png', {frameWidth: 32, frameHeight: 32}
	  this.load.spritesheet(alias, spritePath, {frameWidth: w, frameHeight: h})
  }

  imageCreate(x,y,alias,s,o){
      this.add.image(x,y,alias).setScale(s).setOrigin(o)
  }

  animationCreate(key, alias, s, e, fr, r){ // key
	  this.anims.create({
		  key: key,
		  frames: this.anims.generateFrameNumbers(alias, {
			  start: s,
			  end: e
		  }),
		  frameRate: fr,
		  repeat: r
	  })
  }
  
  textCreate(x,y,text,size){
    this.add.text(x,y,text,{fontSize: size})
  }

  audioPreload(alias, audioPath)
  {
    this.load.audio(alias, audioPath);
  }

  audioCreate(alias){
    return this.sound.add(alias)
  }

}


