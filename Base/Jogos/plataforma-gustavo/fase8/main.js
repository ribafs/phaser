// Arquivo principal do jogo, onde é criada a instância game do Phaser.Game e inicializadas as configurações

let game

window.onload = function(){
	const config = {
		type: Phaser.Canvas, // Phaser.AUTO || Phaser.WebGL
		width: 800,
		height: 550,
		scene: [Scene01],
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {y: 1000}
            }
        },
		pixelArt: true
	}

	game = new Phaser.Game(config)
}
