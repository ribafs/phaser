## Comandos simples do Phaser

A maior parte foi adaptada de

https://end3r.github.io/Gamedev-Phaser-Content-Kit/tutorial

e de https://end3r.github.io/Gamedev-Phaser-Content-Kit/demos/

## Servidor Web
Para que os nossos exemplos/testes funcionem localmente, precisamos ter um servidor web local funcionando.

- preload - carrega na memória inicialmente objetos (carrega)
- create - executado seu código uma única vez, somente após tudo estiver carregado e pronto (inicia)
- update - executada seu código a cada frame (atualiza)

## Cor de fundo do canvas

    game.stage.backgroundColor = '#eee';


## Mudando a Escala do Canvas
```js
function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
}
```
## Tipos de escala:

    NO_SCALE
    EXACT_FIT
    SHOW_ALL
    RESIZE
    USER_SCALE

Detalhes sobre cada um- https://end3r.github.io/Gamedev-Phaser-Content-Kit/tutorial/article02.html

## Mostrar um sprite na tela

Criar a variável/objeto

var ball;// Acima do método preload()

Adicionar o sprite no método preload():
```js
	game.load.image('ball', 'img/ball.png');

	ball - nome dado ao sprite, que será a referência para o mesmo no código
	img/ball.png - caminho do sprite
```
Adicionar ao método create()
```js
	image = game.add.sprite(50, 50, 'ball');

	50, 50 - coordenadas do sprite no canvas
	ball - nome do sprite
```

## Mover objeto usando a física
```js
function create() {
	// Habilitar física ao canvas
    game.physics.startSystem(Phaser.Physics.ARCADE);
	// Posicionar o sprite 'ball' no ponto 50, 50
    ball = game.add.sprite(50, 50, 'ball');
	// Habilitar física para o objeto 'ball'
    game.physics.enable(ball, Phaser.Physics.ARCADE);
	// Setar a velocidade para o objeto
    ball.body.velocity.set(150, 150);
}
```

## Movimento simples,s em física
```js
function update() {
    ball.x += 1;
    ball.y += 1;
}
```
Adiciona 1 para as coordenadas x e y da ball

## Bola rebatendo nas bordas com física
```js
function create() {
	// Habilitar física ao canvas
    game.physics.startSystem(Phaser.Physics.ARCADE);

	// Posicionar o sprite 'ball' no ponto 50, 50
    ball = game.add.sprite(50, 50, 'ball');

	// Habilitar física para o objeto 'ball'
    game.physics.enable(ball, Phaser.Physics.ARCADE);

	// Setar a velocidade para o objeto
    ball.body.velocity.set(150, 150);

	// Rebater nas bordas
	ball.body.collideWorldBounds = true;

	// Fazer a bola parar ao bater
	ball.body.bounce.set(1);
}
```

## Adicionar jogador/paddle (raquete)
Que será movida ao mover o mouse
```js
var paddle;

function preload() {
    game.load.image('paddle', 'img/paddle.png');
}

function create(){
	// Posicionando a raquete/paddle
	paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
}
```

## Centralizar paddle

No create()

paddle.anchor.set(0.5,1);

Colidir com a ball, habilitar a física

game.physics.enable(paddle, Phaser.Physics.ARCADE);

Checar a detecção de colisão no update()

game.physics.arcade.collide(ball, paddle);


## Detectando a colisão entre a bola e os tijolos e eliminar tijolos

Adicionar ao update():
```js
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    paddle.x = game.input.x || game.world.width*0.5;
```
Criar esta função no final do script:
```js
function ballHitBrick(ball, brick) {
    brick.kill();
}
```

## Veja mais detalhes em:
https://end3r.github.io/Gamedev-Phaser-Content-Kit/tutorial/
http://phaser.io/examples

http://phaser.io/sandbox/

Veja que já tem o preload(), o create(), o update() entre outros.

## States
Um state representa uma parte do jogo, um menu, o jogo, o game-over, etc.
Cada state no Phaser tem os métodos preload, create, update e o render.

Dica: quando criar o jogo e se referir aos assets, o faça de forma relativa (sem a barra inicial), mas apenas relativa, para que funcione em quanquer servidor, inclusive localmente.
-    /assets/teste.png - absoluto
-   assets/teste.png - relativo

## Controlar jogador pelas setas/teclado

Criar a variável

var cursors;

Adicionar ao preload():

cursors = game.input.keyboard.createCursorKeys();

Isto popula o objeto cursors com 4 propriedades: up, down, left, right, que são todas elas instências do objeto Phaser.Key. Então tudo que precisamos fazer é adicionar isso ao loop update(): 
```js
   //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground. Permitir que o jogador salte caso esteja tocando o solo
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
```

## Sistema de Pontos/Score

Criar as variáveis
```js
var scoreText;
var score = 0;
```
Adicionar para o create():

scoreText = game.add.text(5, 5, 'Points: 0', { font: '18px Arial', fill: '#0095DD' });

Adicionar ao update():

game.physics.arcade.collide(ball, bricks, ballHitBrick);

Adicionar ao final do script:
```js
function ballHitBrick(ball, brick) {
    brick.kill();// Destroi tijolo que a bola toca
    score += 10;
    scoreText.setText('Points: '+score);
}
```

## Sistema de Vidas/Lives

Adicionar as variáveis na área de variáveis globais:
```js
var lives = 3;
var livesText;
var lifeLostText;
```
Adicionar ao create():
```js
    textStyle = { font: '18px Arial', fill: '#0095DD' };
    scoreText = game.add.text(5, 5, 'Pontos: 0', textStyle);
    livesText = game.add.text(game.world.width-5, 5, 'Vidas: '+lives, textStyle);
    livesText.anchor.set(1,0);
    lifeLostText = game.add.text(game.world.width*0.5, game.world.height*0.5, 'Você perdeu uma vida. Clique para continuar', textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);
```
Adicionar ao final do script:
```js
function ballLeaveScreen() {
    lives--;
    if(lives) {
        livesText.setText('Vidas: '+lives);
        lifeLostText.visible = true;
        ball.reset(game.world.width*0.5, game.world.height-25);
        paddle.reset(game.world.width*0.5, game.world.height-5);
        game.input.onDown.addOnce(function(){
            lifeLostText.visible = false;
            ball.body.velocity.set(150, -150);
        }, this);
    }
    else {
        alert('Você perdeu, game over!');
        location.reload();
    }
}
```
## Game Over

Adicionar ao create():
```js
game.physics.arcade.checkCollision.down = false;
ball.checkWorldBounds = true;
ball.events.onOutOfBounds.add(function(){
    alert('Game over!');
    location.reload();
}, this);
```
## Jogo Finalizado/Win the Game

Adicionar ao update():

game.physics.arcade.collide(ball, bricks, ballHitBrick);

adicionar ao final do script:
```js
function ballHitBrick(ball, brick) {
    brick.kill();
    score += 10;
    scoreText.setText('Points: '+score);
    if(score === brickInfo.count.row*brickInfo.count.col*10) {
        alert('You won the game, congratulations!');
        location.reload();
    }
}
```
## Mais dicas e recursos:
https://end3r.github.io/Gamedev-Phaser-Content-Kit/tutorial/


