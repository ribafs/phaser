
class Enemy_Shot extends Phaser.GameObjects.Sprite{
	constructor(scene, x, y, sprite){
		super(scene, x, y, sprite).setOrigin(0.5, 0.5);
		scene.add.existing(this);
	}
	update(){
		laserEnemyAtivo = 1;
		this.y += 5;
		if(this.y > 450){ 
			this.destroy(); 
			laserEnemyAtivo = 0; 
		}
		var DistImpactoPlayer = Phaser.Math.Distance.Between(obj_player.x, obj_player.y, this.x, this.y);
		if(DistImpactoPlayer < 35){
			//player perde 1 vida
			lives--;
			str_lives.x=520;
			playerVivo = 0;
			this.destroy();
			laserEnemyAtivo = 0;
		}
		if(contadorFramesVitoria > 0){ 
				this.destroy();
				laserEnemyAtivo = 0;
		}
	}
}