class Escudo extends Phaser.GameObjects.Sprite{
	constructor(scene, x, y, sprite){
		super(scene, x, y, sprite).setOrigin(0.5, 0.5);
		scene.add.existing(this);
	}
	update(){
		var DistLaser1;
		var DistLaser2;
		if(laser1Ativo==1){
			DistLaser1 = Phaser.Math.Distance.Between(obj_laser1.x, obj_laser1.y, this.x, this.y);
		}
		if(laser2Ativo==1){
			DistLaser2 = Phaser.Math.Distance.Between(obj_laser2.x, obj_laser2.y, this.x, this.y);
		}
		if(DistLaser1 < 20){ 
			this.destroy(); 
			obj_laser1.destroy(); 
			laser1Ativo = -1; 
			qtdeTiros--;
		}
		if(DistLaser2 < 20){ 
			this.destroy(); 
			obj_laser2.destroy(); 
			laser2Ativo = -1; 
			qtdeTiros--;
		}
		var DistEnemyLaser;
		if(laserEnemyAtivo==1){
			DistEnemyLaser = 
				Phaser.Math.Distance.Between(enemy_shot.x, enemy_shot.y, this.x, this.y);
		}
		if(DistEnemyLaser < 20){ 
			this.destroy(); 
			enemy_shot.destroy(); 
			laserEnemyAtivo = 0;
		}
		if(LimiteBai+obj_agent.y>this.y+20){
			this.destroy();
		}
	}
}
