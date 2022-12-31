Adicionei som para os tiros mas o som não ficou bom.

Não consegui resolver.

Resolvido:

Após uma boa pesquisa percebi que havia adicionado na posição errada.

Assim ficou bem:


		if (cursors.space.isDown && playerPodeAtirar == 1 && qtdeTiros < 2){ 
        // Áudio do tiro
           this.tiro.play()

Onde eu havia insetido ele ficava se repetindo e gerava ruido. Então precisamos ficar atentos para inserir na função ou rotina adequada.



