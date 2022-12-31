// Arquivo principal do jogo, onde é criada a instância game do Phaser.Game e inicializadas as configurações

let game

window.onload = function(){
	const config = {
		type: Phaser.Canvas, // Phaser.AUTO || Phaser.WebGL
		width: 800,
		height: 550,
		scene: [Scene01],
        debug: true // Ao executar o jogo todos os objetos aparecerão com um retângulo vermelho mostrando a área de colisão de cada um
	}

	game = new Phaser.Game(config)
}
