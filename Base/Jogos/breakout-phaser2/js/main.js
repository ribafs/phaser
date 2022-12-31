let game = new Phaser.Game(480, 320, Phaser.AUTO, null, {preload: preload, create: create, update: update});

let bola;
let raquete;
let tijolos;
let novoTijolo;
let tijoloInfo;
let scoreText;
let score = 0;
let lives = 3;
let livesText;
let lifeLostText;
let playing = false;
let startButton;
let adaptacaoText = false;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';
    game.load.image('raquete', 'assets/images/raquete.png');
    game.load.image('tijolo', 'assets/images/tijolo.png');
    game.load.spritesheet('bola', 'assets/sprites/oscilar.png', 20, 20);
    game.load.spritesheet('button', 'assets/images/button.png', 120, 40);
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;
    bola = game.add.sprite(game.world.width*0.5, game.world.height-25, 'bola');
    bola.animations.add('oscilar', [0,1,0,2,0,1,0,2,0], 24);
    bola.anchor.set(0.5);
    game.physics.enable(bola, Phaser.Physics.ARCADE);
    bola.body.collideWorldBounds = true;
    bola.body.bounce.set(1);
    bola.checkWorldBounds = true;
    bola.events.onOutOfBounds.add(bolaLeaveScreen, this);

    raquete = game.add.sprite(game.world.width*0.5, game.world.height-5, 'raquete');
    raquete.anchor.set(0.5,1);
    game.physics.enable(raquete, Phaser.Physics.ARCADE);
    raquete.body.immovable = true;

    inittijolos();

    textStyle = { font: '18px Arial', fill: '#0095DD' };
    scoreText = game.add.text(5, 5, 'Pontos: 0', textStyle);
    livesText = game.add.text(game.world.width-5, 5, 'Vidas: '+lives, textStyle);
    livesText.anchor.set(1,0);
    lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, 'Você perdeu uma vida. Clique para continuar', textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;

    startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
    startButton.anchor.set(0.5);

    adaptacaoText = game.add.text(game.world.width*0.5, game.world.height*0.8, 'Use o mouse para mover a raquete', textStyle);
    adaptacaoText.anchor.set(0.5);
    adaptacaoText.visible = true;
}

function update() {
    game.physics.arcade.collide(bola, raquete, bolaHitraquete);
    game.physics.arcade.collide(bola, tijolos, bolaHittijolo);
    if(playing) {
        raquete.x = game.input.x || game.world.width*0.5;
    }

}
function inittijolos() {
    tijoloInfo = {
        width: 50,
        height: 20,
        count: {
            row: 7,
            col: 3
        },
        offset: {
            top: 50,
            left: 60
        },
        padding: 10
    }
    tijolos = game.add.group();
    // Renderizando os tijolos na tela
    for(c=0; c<tijoloInfo.count.col; c++) {
        for(r=0; r<tijoloInfo.count.row; r++) {
            let tijoloX = (r*(tijoloInfo.width+tijoloInfo.padding))+tijoloInfo.offset.left;
            let tijoloY = (c*(tijoloInfo.height+tijoloInfo.padding))+tijoloInfo.offset.top;
            novoTijolo = game.add.sprite(tijoloX, tijoloY, 'tijolo');
            game.physics.enable(novoTijolo, Phaser.Physics.ARCADE);
            novoTijolo.body.immovable = true;
            novoTijolo.anchor.set(0.5);
            tijolos.add(novoTijolo);
        }
    }
}
function bolaHittijolo(bola, tijolo) {
    let killTween = game.add.tween(tijolo.scale);
    killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function(){
        tijolo.kill();
    }, this);
    killTween.start();
    score += 10;
    scoreText.setText('Pontos: '+score);
    if(score === tijoloInfo.count.row*tijoloInfo.count.col*10) {
        alert('Você venceu o jogo, parabéns!');
        location.reload();
    }
}
function bolaLeaveScreen() {
    lives--;
    if(lives) {
        livesText.setText('Vidas: '+lives);
        lifeLostText.visible = true;
        bola.reset(game.world.width*0.5, game.world.height-25);
        raquete.reset(game.world.width*0.5, game.world.height-5);
        game.input.onDown.addOnce(function(){
            lifeLostText.visible = false;
            bola.body.velocity.set(150, -150);
        }, this);
    }
    else {
        alert('Você perdeu, game over!');
        location.reload();
    }
}
function bolaHitraquete(bola, raquete) {
    bola.animations.play('oscilar');
    bola.body.velocity.x = -1*5*(raquete.x-bola.x);
}
function startGame() {
    startButton.destroy();
    bola.body.velocity.set(150, -150);
    playing = true;
    adaptacaoText.visible = false;
}
