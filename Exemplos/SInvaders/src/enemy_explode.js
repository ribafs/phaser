
class Enemy_Explode extends Phaser.GameObjects.Sprite{
	constructor(scene, x, y, sprite){
		super(scene, x, y, sprite).setOrigin(0.5, 0.5);
		this.anims.play(sprite, true);
		scene.add.existing(this);
	}
	update(){
		this.once('animationcomplete', () => { this.destroy(); });
	}
}