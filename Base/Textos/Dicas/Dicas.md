# Dicas sobre o Phaser 3

## Alinhar objeto na tela:

Centralizar na horizontal (x) e na vertical (y):
objeto.anchor.set(.5);// (.5) = (0.5, 0.5)

Alinhar no canto superior direito (x=1 e y=0):
objeto.anchor.set(1, 0);

Alinhas no canto superior esquerdo:
objeto.anchor.set(0, 1);

Alinhar no canto inferior esquerdo:
objeto.anchor.set(0, 1);

Alinhas no canto inferior direito:
objeto.anchor.set(1, 1); // ou (1)


Usando teclado

function create() {
    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)


Phaser.Keyboard.SPACEBAR


this.sky = this.add.image(0,0, 'sky').setOrigin(0,0) // setOrigin configura o ponto de origem de um objeto. Valor de 0 a 1 e 0,0 é similar a 0

Assinar a Newsletter

https://phaser.io/community

Bug report - https://github.com/photonstorm/phaser/issues


Quando pesquisamos por exemplos do Phaser 3, como este:

https://phaser.io/examples/v3/view/plugins/custom-game-object

Veja que abaixo temos 3 botões:

Open - este abre o exemplo em uma janela separada/popup
Edit - este abre o código fonte do exemplo (muito prático)
Reload - este executa o exemplo novamente

Linha

var obj = this.add.line(400, 300, 30, 0, 0, 0, 0x00cccc).setLineWidth(4, 15);

Plugin

npm install phaser3-rex-plugins


Entrada do user

var player = prompt("Please enter your name", "name");

Salvar com local storage

localStorage.setItem("playerName", player);

Usar depois

localStorage.getItem("playerName");


