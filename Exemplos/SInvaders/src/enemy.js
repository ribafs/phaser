
class Enemy extends Phaser.GameObjects.Sprite{
	constructor(scene, x, y, sprite){
		super(scene, x, y, sprite).setOrigin(0.5, 0.5);
		scene.add.existing(this);
	}
	update(){
		var sLado; 
		var sAjuste;
		if(this.x<400){ 
			sLado = 1; 
			sAjuste = 0;
		} else{ 
			sLado = -1; 
			sAjuste = -400;
		}
		this.scale = (((this.x-200+sAjuste)/20)*(0.02*sLado))+1;
		
		if(contadorFramesDerrota == 1 && (LimiteBai+obj_agent.y>410) ){ this.y += 5; }
		this.x = (obj_agent.x - agentOldX) + this.x;
		this.y = (obj_agent.y - agentOldY) + this.y;
		var DistLaser1;
		var DistLaser2;
		if(laser1Ativo==1){
			DistLaser1 = Phaser.Math.Distance.Between(obj_laser1.x, obj_laser1.y, this.x, this.y);
		}
		if(laser2Ativo==1){
			DistLaser2 = Phaser.Math.Distance.Between(obj_laser2.x, obj_laser2.y, this.x, this.y);
		}
		var enemyPosicaoArrayX = Math.round( ((Math.floor(this.x) - Math.floor(obj_agent.x))+225)/50 );
		var enemyPosicaoArrayY = Math.round( (Math.floor(this.y) - Math.floor(obj_agent.y))/50 );
		if(DistLaser1 < 25){ 
			this.destroy(); 
			agentArraySensor[enemyPosicaoArrayY][enemyPosicaoArrayX] = 0;
			agentVel += 0.225;
			if(enemyPosicaoArrayY == 0) { score += 30; str_score.x=120; }
			if(enemyPosicaoArrayY == 1) { score += 20; str_score.x=120; }
			if(enemyPosicaoArrayY >= 2) { score += 10; str_score.x=120; }
			obj_laser1.destroy(); 
			laser1Ativo = -1; 
			qtdeTiros--;
		}
		if(DistLaser2 < 25){ 
			this.destroy(); 
			agentArraySensor[enemyPosicaoArrayY][enemyPosicaoArrayX] = 0;
			agentVel += 0.225;
			if(enemyPosicaoArrayY == 0) { score += 30; str_score.x=120; }
			if(enemyPosicaoArrayY == 1) { score += 20; str_score.x=120; }
			if(enemyPosicaoArrayY >= 2) { score += 10; str_score.x=120; }
			obj_laser2.destroy(); 
			laser2Ativo = -1; 
			qtdeTiros--;
		}
	}
}