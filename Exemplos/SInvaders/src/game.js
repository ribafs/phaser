
///////////////////////////////
// SInvaders by Daniel Moura //
///////////////////////////////

var config = {
	type: Phaser.AUTO,
    width: 800,
    height: 450,
	scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
	input: {
        activePointers: 3
    },
	pixelArt: true,
	backgroundColor: 0x000000,
    scene: { init: init, preload: preload, create: create, update: update, render: render }
}
var game = new Phaser.Game(config);

var playerPodeAtirar = 1;
var playerPodeMover = 1;
var QtdeInimigos = 0;
var contadorFramesVitoria = 0;
var playerVivo = 1;
var contadorFramesDerrota = 0;
var qtdeTiros = 0;
var laser1Ativo = 0;
var laser2Ativo = 0;
var laserEnemyAtivo = 0;
var flareTimer = 0;
var agentDir = 1;
var agentVel = 1;
var agentOldX = 400;
var agentOldY = 50;
var agentArraySensor = [
	[1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1]
];
var LimiteEsq = -250;
var LimiteDir =  250;
var LimiteBai =  200;
var score = 0;
var lives = 3;
var IntervaloTirosInimigos = 0;
var strDebug;
var str_score;
var str_lives;

function init ()
{
}

function preload ()
{
	this.load.image('spr_bg', 'img/spr_bg.png');
	this.load.image('spr_agent', 'img/spr_agent.png');
	this.load.image('spr_player', 'img/spr_player.png');
	this.load.image('spr_laser', 'img/spr_laser.png');
	this.load.image('spr_enemy_laser', 'img/spr_enemy_laser.png');
	this.load.image('spr_flare', 'img/spr_flare.png');
	this.load.image('spr_enemy1', 'img/spr_enemy1.png');
	this.load.image('spr_enemy2', 'img/spr_enemy2.png');
	this.load.image('spr_enemy3', 'img/spr_enemy3.png');
	this.load.image('spr_escudo', 'img/spr_escudo.png');
	this.load.spritesheet('spr_escudo_explode', 'img/spr_escudo_explode.png',{ 
		frameWidth: 40, 
		frameHeight: 40 
	});
	this.load.spritesheet('spr_fire_fx', 'img/spr_fire_fx.png',{ 
		frameWidth: 16, 
		frameHeight: 30 
	});
	this.load.spritesheet('spr_enemy_explode', 'img/spr_enemy_explode.png',{ 
		frameWidth: 70, 
		frameHeight: 70 
	});
	this.load.image('spr_hud', 'img/spr_hud.png');
	this.load.image('spr_gameover', 'img/spr_gameover.png');
	this.load.spritesheet('spr_player_explode', 'img/spr_player_explode.png',{ 
		frameWidth: 80, 
		frameHeight: 80 
	});
}

function create ()
{
	this.add.image(0, 0, 'spr_bg').setOrigin(0, 0);
	obj_player = this.add.image(400, 440, 'spr_player').setOrigin(0.5, 1);
	this.anims.create({	
		key: 'spr_fire_fx', 
		frames: this.anims.generateFrameNumbers('spr_fire_fx'), 
		frameRate: 24,	
		repeat: -1 
	});
	this.anims.create({	
		key: 'spr_enemy_explode', 
		frames: this.anims.generateFrameNumbers('spr_enemy_explode'), 
		frameRate: 20,	
		repeat: 0 
	});
	this.anims.create({	
		key: 'spr_player_explode', 
		frames: this.anims.generateFrameNumbers('spr_player_explode'), 
		frameRate: 20,	
		repeat: 0 
	});
	obj_fire_fx1 = this.add.sprite(obj_player.x, obj_player.y, 'spr_fire_fx').setOrigin(0.5, 0.5);
	obj_fire_fx2 = this.add.sprite(obj_player.x, obj_player.y, 'spr_fire_fx').setOrigin(0.5, 0.5);
	obj_fire_fx1.anims.play('spr_fire_fx', true);
	obj_fire_fx2.anims.play('spr_fire_fx', true);
	cursors = this.input.keyboard.createCursorKeys();
	obj_player.depth = 1;
	obj_fire_fx1.depth = 1;
	obj_fire_fx2.depth = 1;
	strDebug = this.add.text(400, 220, '-DEBUG-', { 
		fontFamily: 'Verdana', 
		fontSize: '22px', 
		fill: '#FF0000' 
	}).setOrigin(0.5,0);
	str_score = this.add.text(150, 20, '', { 
		fontFamily: 'Impact', 
		fontSize: '40px', 
		fill: '#FFFFFF' 
	}).setOrigin(0,0.5);
	str_lives = this.add.text(500, 20, '', { 
		fontFamily: 'Impact', 
		fontSize: '40px', 
		fill: '#FFFFFF' 
	}).setOrigin(0,0.5);
	obj_flare = this.add.image(obj_player.x, obj_player.y-55, 'spr_flare').setOrigin(0.5, 0.5); 
	obj_flare.visible = 0;
	this.Group_Enemy = this.add.group({runChildUpdate:true});
	this.Group_Enemy_Explode = this.add.group({runChildUpdate:true});
	this.Group_Enemy_Shot = this.add.group({runChildUpdate:true});
	this.Group_Escudo = this.add.group({runChildUpdate:true});
	var OrigemX = 175;
	var OrigemY =  50;
	for(i=0; i<=9; i++){
		for(j=0; j<=3; j++){
			var sprite = '';
			if(j==0){ sprite = 'spr_enemy1'; }
			if(j==1){ sprite = 'spr_enemy2'; }
			if(j>=2){ sprite = 'spr_enemy3'; }
			this.Group_Enemy.add(enemy = new Enemy(this, OrigemX+50*i, OrigemY+50*j, sprite));
		}
	}
	var LayoutEscudos = [
		[0,0,1,0,0],
		[0,1,1,1,0],
		[1,1,1,1,1]
	];
	for(i=0; i<=2; i++){
		for(j=0; j<=4; j++){
			for(k=-1; k<=1; k++){
				if(LayoutEscudos[i][j] == 1){ 
				this.Group_Escudo.add(escudo = 
					new Escudo(this, k*250+360+20*j, 330+20*i, 'spr_escudo')); 
				}
			}
		}
	}
	obj_agent = this.add.sprite(400, 100, 'spr_agent').setOrigin(0.5, 0.5);
	obj_agent.visible = 0;
	graphics = this.add.graphics();
	this.add.image(0, 0, 'spr_hud').setOrigin(0, 0).setAlpha(0.5);
}

function update ()
{
	IntervaloTirosInimigos++;
	if(IntervaloTirosInimigos>120){
		IntervaloTirosInimigos = 0;
	}
	
	//agent
	QtdeInimigos = 0;
	var buscandoLimiteEsq = 1;
	LimiteEsq = 0;
	LimiteDir = 0;
	for(i=0; i<=9; i++){
		for(j=0; j<=3; j++){
			QtdeInimigos += agentArraySensor[j][i];
			var vtemp;
			if(i == 0){ vtemp = -250; }
			if(i == 1){ vtemp = -200; }
			if(i == 2){ vtemp = -150; }
			if(i == 3){ vtemp = -100; }
			if(i == 4){ vtemp = - 50; }
			if(i == 5){ vtemp =    0; }
			if(i == 6){ vtemp =   50; }
			if(i == 7){ vtemp =  100; }
			if(i == 8){ vtemp =  150; }
			if(i == 9){ vtemp =  200; }
			if(buscandoLimiteEsq == 1 && agentArraySensor[j][i] != 0){
				LimiteEsq = vtemp;
				buscandoLimiteEsq = 0;
			}
			if(agentArraySensor[j][i] != 0){
				LimiteDir = vtemp+50;
			}
		}
	}
	LimiteBai = 0;
	for(i=0; i<=3; i++){
		for(j=0; j<=9; j++){
			var vtemp;
			if(i == 0){ vtemp =  50; }
			if(i == 1){ vtemp = 100; }
			if(i == 2){ vtemp = 150; }
			if(i == 3){ vtemp = 200; }
			if(agentArraySensor[i][j] != 0){
				LimiteBai = vtemp;
			}
		}
	}
	/*
	graphics.clear();
	graphics.fillStyle(0xff0000, 0.5); 
	graphics.fillRect(
		obj_agent.x + LimiteEsq, 
		obj_agent.y - 25, 
		LimiteDir - LimiteEsq, 
		LimiteBai
	);
	*/
	agentOldX = obj_agent.x;
	agentOldY = obj_agent.y;
	if(obj_agent.x > (400-LimiteDir)+400) { 
		agentDir = -1; 
		obj_agent.x = (400-LimiteDir)+400; 
		obj_agent.y += 5;
	}
	if(obj_agent.x < LimiteEsq*-1) { 
		agentDir =  1; 
		obj_agent.x = LimiteEsq*-1;
		obj_agent.y += 5;
	}
	if(contadorFramesVitoria==0){
		obj_agent.x += agentVel * agentDir;
	}
	
	//Inimigo atira
	if(QtdeInimigos>0){
		var EVEPA = 0; //(E)sta (V)ivo (E) (P)ode (A)tirar
		var Disparo_Linha = 0;
		var Disparo_Coluna = 0;
		while(EVEPA == 0){
			var sorteio = Phaser.Math.Between(0, 39);
			var sorteio = sorteio/10;
			var parte_inteira = Math.floor(sorteio);
			var parte_fracionada = Math.round((sorteio - parte_inteira) * 10);
			EVEPA = agentArraySensor[parte_inteira][parte_fracionada];
			Disparo_Linha = parte_inteira;
			Disparo_Coluna = parte_fracionada;
		}
		if(Disparo_Linha == 0){ Disparo_Linha = obj_agent.y+ 50-25; }
		if(Disparo_Linha == 1){ Disparo_Linha = obj_agent.y+100-25; }
		if(Disparo_Linha == 2){ Disparo_Linha = obj_agent.y+150-25; }
		if(Disparo_Linha == 3){ Disparo_Linha = obj_agent.y+200-25; }
		if(Disparo_Coluna == 0){ Disparo_Coluna = obj_agent.x-250+25; }
		if(Disparo_Coluna == 1){ Disparo_Coluna = obj_agent.x-200+25; }
		if(Disparo_Coluna == 2){ Disparo_Coluna = obj_agent.x-150+25; }
		if(Disparo_Coluna == 3){ Disparo_Coluna = obj_agent.x-100+25; }
		if(Disparo_Coluna == 4){ Disparo_Coluna = obj_agent.x- 50+25; }
		if(Disparo_Coluna == 5){ Disparo_Coluna = obj_agent.x-  0+25; }
		if(Disparo_Coluna == 6){ Disparo_Coluna = obj_agent.x+ 50+25; }
		if(Disparo_Coluna == 7){ Disparo_Coluna = obj_agent.x+100+25; }
		if(Disparo_Coluna == 8){ Disparo_Coluna = obj_agent.x+150+25; }
		if(Disparo_Coluna == 9){ Disparo_Coluna = obj_agent.x+200+25; }
		if( IntervaloTirosInimigos == 0 && contadorFramesDerrota == 0 ){
			this.Group_Enemy.add(enemy_shot = 
				new Enemy_Shot(this, Disparo_Coluna, Disparo_Linha, 'spr_enemy_laser'));
		}
	}
	
	//flare fx
	if(flareTimer>0){ 
		flareTimer-=0.1; 
		obj_flare.alpha = flareTimer; 
		obj_flare.scaleX = flareTimer;
		obj_flare.scaleY = flareTimer; 
	}else { 
		obj_flare.visible = 0; 
	}
	
	//player
	if(QtdeInimigos == 0){ 
		playerPodeMover = 0; 
		contadorFramesVitoria++;
		if (laser1Ativo == 1) { obj_laser1.y-=10; }
		if (laser2Ativo == 1) { obj_laser2.y-=10; }
	}
	if(contadorFramesVitoria>0){
		laser1Ativo = 0;
		laser2Ativo = 0;
	}
	if(playerPodeMover == 1){
		if (cursors.left.isDown ){ obj_player.x -= 5; }
		if (cursors.right.isDown){ obj_player.x += 5; }
		
		obj_fire_fx2.flipX = 1;
		if(cursors.left.isDown){
			obj_fire_fx2.scale = 2;
			obj_fire_fx2.angle = -45;
			obj_fire_fx2.setOrigin(0.3,0.25);
		}else{
			obj_fire_fx2.scale = 1;
			obj_fire_fx2.angle = 0;
			obj_fire_fx2.setOrigin(.5);
		}
		if(cursors.right.isDown){
			obj_fire_fx1.scale = 2;
			obj_fire_fx1.angle = +45;
			obj_fire_fx1.setOrigin(0.7,0.25);
		}else{
			obj_fire_fx1.scale = 1;
			obj_fire_fx1.angle = 0;
			obj_fire_fx1.setOrigin(.5);
		}
		
		obj_flare.x = obj_player.x; 
		obj_flare.y = obj_player.y-55;
		
		if (cursors.space.isDown && playerPodeAtirar == 1 && qtdeTiros < 2){ 
		if(qtdeTiros <= 1 && laser1Ativo == 0) { 
			obj_laser1 = this.add.image(obj_player.x, obj_player.y-55, 'spr_laser').setOrigin(0.5, 0.25); 
			obj_flare.visible = 1; flareTimer = 1;
			laser1Ativo = 1;
		}
		if(qtdeTiros == 1 && laser2Ativo == 0) { 
			obj_laser2 = this.add.image(obj_player.x, obj_player.y-55, 'spr_laser').setOrigin(0.5, 0.25); 
			obj_flare.visible = 1; flareTimer = 1;
			laser2Ativo = 1;
		}
		qtdeTiros++;
		playerPodeAtirar=0;
		}
		if (cursors.space.isUp){ playerPodeAtirar = 1; }
		if (laser1Ativo == 1) { 
			obj_laser1.y-=10; 
			if(obj_laser1.y < -70){ 
				obj_laser1.destroy(); 
				laser1Ativo = 0; 
				qtdeTiros--;
			}
		}
		if (laser2Ativo == 1) { 
			obj_laser2.y-=10; 
			if(obj_laser2.y < -70){ 
				obj_laser2.destroy(); 
				laser2Ativo = 0; 
				qtdeTiros--;
			}
		}
		if (laser1Ativo == -1){
			laser1Ativo = 0;
				this.Group_Enemy_Explode.add(enemy_explode = 
					new Enemy_Explode(this, obj_laser1.x, obj_laser1.y, 'spr_enemy_explode'));
		}
		if (laser2Ativo == -1){
			laser2Ativo = 0;
				this.Group_Enemy_Explode.add(enemy_explode = 
					new Enemy_Explode(this, obj_laser2.x, obj_laser2.y, 'spr_enemy_explode'));
		}
		if (obj_player.x <  35) { obj_player.x =  35; }
		if (obj_player.x > 765) { obj_player.x = 765; }
		obj_fire_fx1.x = obj_player.x - 15;
		obj_fire_fx1.y = obj_player.y +  3;
		obj_fire_fx2.x = obj_player.x + 15;
		obj_fire_fx2.y = obj_player.y +  3;
	}
	
	//Vitoria
	if(contadorFramesVitoria == 120){
		obj_player.x = 400;
		obj_agent.x = 400;
		obj_agent.y = 100;
		agentOldX = 400;
		agentOldY = 100;
		agentVel = 1;
		playerPodeMover = 1;
		contadorFramesVitoria = 0;
		QtdeInimigos = 40;
		agentArraySensor = [
			[1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1]
		];
		var OrigemX = obj_agent.x-225;
		var OrigemY = obj_agent.y;
		for(i=0; i<=9; i++){
			for(j=0; j<=3; j++){
				var sprite = '';
				if(j==0){ sprite = 'spr_enemy1'; }
				if(j==1){ sprite = 'spr_enemy2'; }
				if(j>=2){ sprite = 'spr_enemy3'; }
				this.Group_Enemy.add(enemy = new Enemy(this, OrigemX+50*i, OrigemY+50*j, sprite));
			}
		}
	}
	
	//GameOver na cara
	if(LimiteBai+obj_agent.y>410){
		playerVivo = 0;
		lives = 0;
		obj_agent.y += 2;
	}
	if(contadorFramesDerrota == 1){
		obj_player_explode = this.add.sprite(
			obj_player.x, 
			obj_player.y-25, 
			'spr_player_explode').setOrigin(0.5, 0.5);
			obj_player_explode.anims.play('spr_player_explode', true);
			obj_player_explode.once(
			Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => { 
				obj_player_explode.destroy(); 
			}
		)
	}
	if(contadorFramesDerrota == 60){
		if(lives == 0){
		obj_gameover = this.add.image(400, 225, 'spr_gameover').setOrigin(0.5, 0.5);
		obj_gameover.alpha = 0;
		}else{
			playerVivo = 1;
			playerPodeMover = 1; 
			obj_player.visible = 1;
			obj_fire_fx1.visible = 1;
			obj_fire_fx2.visible = 1;
			if(laser1Ativo == 1) { obj_laser1.visible = 1; }
			if(laser2Ativo == 1) { obj_laser2.visible = 1; }
			contadorFramesDerrota = 0;
		}
	}
	if(playerVivo == 0){ 
		if(contadorFramesDerrota>60 && lives==0) { obj_gameover.alpha+=0.02; }
		playerPodeMover = 0; 
		obj_player.visible = 0;
		obj_fire_fx1.visible = 0;
		obj_fire_fx2.visible = 0;
		if(laser1Ativo == 1) { obj_laser1.visible = 0; }
		if(laser2Ativo == 1) { obj_laser2.visible = 0; }
		obj_agent.x = agentOldX;
		if(contadorFramesDerrota < 60){ obj_agent.y = agentOldY; }
		contadorFramesDerrota++;
	}
	
	strDebug.setText(
		//'SInvaders' + '\n' + 
		/*'Qtde de Tiros: ' + qtdeTiros + '\n' + 
		'laser1Ativo: ' + laser1Ativo + '\n' + 
		'laser2Ativo: ' + laser2Ativo + '\n' + 
		'agentArraySensor: \n' + 
		agentArraySensor[0] + '\n' + 
		agentArraySensor[1] + '\n' + 
		agentArraySensor[2] + '\n' + 
		agentArraySensor[3] + '\n'*/
	);
	
	if(str_score.x < 150){ str_score.x+=2; }
	if(str_lives.x > 500){ str_lives.x-=2; }
	str_score.setText('Score:  ' + score);
	str_lives.setText('Lives:  ' + lives);
	str_score.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
	str_lives.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
	str_score.depth = 10;
	str_lives.depth = 10;
}

function render ()
{
}

