//import Methods from './Methods.js'

export default class Methods
{
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

