/* SCRIPT QUE CONTROLA LA CLASE DEL JUGADOR */
/*-----------------------------------------------------------------------------------------------------------------------------*/

class Player extends Phaser.Physics.Arcade.Sprite
{

    /* CONSTRUCTOR */
    constructor(scene,x,y)
    {

        super(scene,x,y,'player');  // Llamada al constructor "super" con los parámetros de escena, posición y clave de la textura

        this.scene = scene;  // Adición de la escena en la que se localizará el jugador como parámetro

        // INCORPORACIÓN DEL JUGADOR A LA ESCENA LÓGICA Y A LA ESCENA FÍSICA
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // SE HABILITA EL ATAJO DE LAS TECLAS BÁSICAS
        //continuación
        this.cursor = this.scene.input.keyboard.createCursorKeys();

        // FLAGS
        this.is_right_not_left = true;  // Flag para conocer en todo momento la dirección del jugador (se usa para caminar, disparar,...)

        /*------------------------*/
        /* ASIGNACIÓN DE ANIMACIONES */

        // IDLE IZQUIERDA
        this.anims.create({
            key: 'left_idle',
            frames: this.scene.anims.generateFrameNames('sprites_left_idle_jugador', { start: 1, end: 8, prefix: 'mainidleleft' }),
            frameRate: 10,
            repeat: -1
        });

        // IDLE DERECHA
        this.anims.create({
            key: 'right_idle',
            frames: this.scene.anims.generateFrameNames('sprites_right_idle_jugador', { start: 0, end: 7, prefix: 'custom_idle_' }),
            frameRate: 10,
            repeat: -1
        });

        // CAMINAR HACIA LA IZQUIERDA
        this.anims.create({
            key: 'left_walk',
            frames: this.scene.anims.generateFrameNames('sprites_left_walk_jugador', { start: 1, end: 8, prefix: 'custom_left_walk_' }),
            frameRate: 10,
            repeat: -1
        });

        // CAMINAR HACIA LA DERECHA
        this.anims.create({
            key: 'right_walk',
            frames: this.scene.anims.generateFrameNames('sprites_right_walk_jugador', { start: 1, end: 8, prefix: 'custom_right_walk_' }),
            frameRate: 10,
            repeat: -1
        });

        // SALTAR HACIA LA IZQUIERDA
        this.anims.create({
            key: 'jump_left',
            frames: this.scene.anims.generateFrameNames('sprites_left_jump_jugador', { start: 1, end: 4, prefix: 'mainjumpleft' }),
            frameRate: 10,
            repeat: -1
        });

        // SALTAR HACIA LA DERECHA
        this.anims.create({
            key: 'jump_right',
            frames: this.scene.anims.generateFrameNames('sprites_right_jump_jugador', { start: 1, end: 4, prefix: 'mainjumpright' }),
            frameRate: 10,
            repeat: -1
        });

         /*------------------------*/
        
        // SE AÑADE UN ATAJO PARA LA LETRA F Y SE OBTIENEEL TIEMPO INICIAL DE ESPERA PARA DISPARAR (EQUIVALE A 0)
        this.keyF = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.next_shoot = this.obtenerMilisegundosActuales();

/*-----------------------------------------------------------------------------------------------------------------------------*/       

        /* PARÁMETROS DEL JUGADOR */

        this.velocidad_de_recarga_de_disparo = 2000;  // en milisegundos
        this.tiempoInmune = 0;

    }

/*-----------------------------------------------------------------------------------------------------------------------------*/


    /* FUNCIÓN UPDATE QUE SE EJECUTA EN CADA FRAME AL SER LLAMADA DESDE EL UPDATE DE LA ESCENA */
    update(time,delta, scene)
    {

        /*------------------------*/
        /* MOVIMIENTO DEL JUGADOR */

        // SI SE PULSA LA FLECHA IZQUIERDA EL JUGADOR AVANZA HACIA LA IZQUIERDA
        if(this.cursor.left.isDown)
        {
            this.is_right_not_left = false;
            this.setVelocityX(-200);
            this.setFlipX(true); 
        }

        // SI SE PULSA LA FLECHA DERECHA EL JUGADOR AVANZA HACIA LA DERECHA
        else if(this.cursor.right.isDown)
        {
            this.is_right_not_left = true;
            this.setVelocityX(200);
            this.setFlipX(false); 
        }

        // SI NO SE PULSA NADA EL JUGADOR PERMANECE PARADO
        else
        {
            // Parado
            this.setVelocityX(0);
        }

        // SI SE PULSA ESPACIO Y EL JUGADOR ESTÁ EN EL SUELO PUEDE SALTAR
        if (this.cursor.space.isDown && this.body.onFloor()) {
            this.setVelocityY(-200);
            this.scene.jumping_sound.play();  // Se activa el sonido de salto
        }

        /*------------------------*/


        // SI SE PULSA LA TECLA F EL JUGADOR DISPARA
        if(this.keyF.isDown){
            this.disparar();
        }

        /*------------------------*/
        /* CONTROLADOR DE ANIMACIONES */

        // ANIMACIÓN DE SALTO
        if(!this.body.onFloor()){
            if(this.is_right_not_left) this.play('jump_right', true);
            else this.play('jump_left', true);
        }

        // ANIMACIÓN DE CAMINAR
        else if(this.body.velocity.x != 0){
            if(this.is_right_not_left) this.play('right_walk', true);
            else this.play('left_walk', true);
        }
            
        // ANIMACIÓN DE IDLE
        else
        if(this.is_right_not_left) this.play('right_idle', true);
        else this.play('left_idle', true);

        /*------------------------*/

        // TIEMPO DE INMUNIDAD DEL JUGADOR TRAS COLISIONAR CON ENEMIGO   
        if(this.tiempoInmune>0){
            this.tiempoInmune--;
            this.setAlpha(0.5);
        } else {
            this.setAlpha(1);
        }

    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* MÉTODOS DE ACCIONES DEL JUGADOR */

    // MÉTODO QUE PERMITE DISPARAR AL JUGADOR
    disparar(){
        
        if(this.next_shoot < this.obtenerMilisegundosActuales()){  // Se espera un cierto tiempo entre disparos

            this.next_shoot = this.obtenerMilisegundosActuales() + this.velocidad_de_recarga_de_disparo;  // Definición del tiempo entre disparos

            // INSTANCIACIÓN DEL DISPARO
            this.disparo = new Disparo(this.scene, this.body.x+30, this.body.y+40);

            // SE ESTABLECE LA VELOCIDAD DEL DISPARO
            if(this.is_right_not_left) this.disparo.setVelocityX(this.disparo.velocidadDisparo);
            else this.disparo.setVelocityX(-this.disparo.velocidadDisparo);

            this.scene.aniadirDisparo();  // Se añade el disparo al conjunto de disparos

            this.scene.shooting_sound.play();  // Suena el sonido de disparo

            console.log("fuego");  // Mensaje de depuración por consola

       }

    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* MÉTODOS AUXILIARES */

    // MÉTODO AUXILIAR PARA OBTENER EL TIEMPO EN MILISEGUNDOS Y ELABORAR CONTADORES
    obtenerMilisegundosActuales(){
        var fecha_actual = new Date();  // Obtenemos la fecha actual
        var milisegundos_actuales = fecha_actual.getTime();  // Obtenemos los milisegundos desde el 1 de Enero de 1970 hasta ahora
        return milisegundos_actuales;  // Devolvemos los milisegundos
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/


}

/*-----------------------------------------------------------------------------------------------------------------------------*/