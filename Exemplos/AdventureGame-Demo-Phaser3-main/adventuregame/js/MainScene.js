/* SCRIPT QUE CONTROLA LA CLASE PRINCIPAL DE LA ESCENA */
/*-----------------------------------------------------------------------------------------------------------------------------*/

class MainScene extends Phaser.Scene
{

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* CONSTRUCTOR */
    constructor(){
        super('MainScene');  // Se le asigna el nombre a la escena
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* MÉTODOS BÁSICOS DE LA ESCENA */

    // MÉTODO DE PRECARGA DE LA ESCENA
    preload()
    {

        // CARGA DE LA IMAGEN DEL MAPA Y DEL TILESET
        this.load.image('tiles','res/Tileset.png');
        this.load.tilemapTiledJSON('map','res/Map.json');

        // CARGA DE LA IMAGEN DEL BACKGROUND
        this.load.image('bg-1', 'res/CustomBackground.png');

        // CARGA DE LA IMAGEN DEL AGUA
        this.load.image('sea', 'res/sea.png');

        // CARGA DE LA IMAGEN INICIAL DEL JUGADOR
        this.load.image('player', 'res/mainidle_1.png');

        // CARGA DE LA IMAGEN DE VIDAS DE LA UI DEL JUGADOR
        this.load.image('UIlives_image', 'res/UILives.png');

        // CARGA DE LA IMAGEN DE CROCOMONEDAS DE LA UI DEL JUGADOR
        this.load.image('UIcrococoin_image', 'res/UICrococoin.png');

        // CARGA DE LA IMAGEN DE LAS TRAMPAS
        this.load.image('tilesTrampas', 'res/trampaPinchos.png');

        // CARGA DE LA IMAGEN INICIAL DEL ENEMIGO
        this.load.image('enemy', 'res/enemy.png');

        // CARGA DE LA IMAGEN DEL DISPARO DEL JUGADOR
        this.load.image('disparo', 'res/disparoJugador.png');

        // CARGA DE LAS IMÁGENES DE LA META
        this.load.image('goal', 'res/Goal.png');
        this.load.image('goal_data', 'res/GoalInfo.png');

        // CARGA DE LOS ATLAS DEL JUGADOR
        // Phaser.Physics.Arcade.Sprite
        // https://gammafp.com/tool/atlas-packer/
        this.load.atlas('sprites_left_idle_jugador','res/player_anim/main_idle_left.png',
        'res/player_anim/main_idle_left_atlas.json');
        this.load.atlas('sprites_right_idle_jugador','res/player_anim/custom_player_anim.png',
        'res/player_anim/custom_player_anim_atlas.json');
        this.load.atlas('sprites_left_walk_jugador','res/player_anim/custom_left_walk.png',
        'res/player_anim/custom_left_walk_atlas.json');
        this.load.atlas('sprites_right_walk_jugador','res/player_anim/custom_right_walk.png',
        'res/player_anim/custom_right_walk_atlas.json');
        this.load.atlas('sprites_left_jump_jugador','res/player_anim/main_jump_left.png',
        'res/player_anim/main_jump_left_atlas.json');
        this.load.atlas('sprites_right_jump_jugador','res/player_anim/main_jump_right.png',
        'res/player_anim/main_jump_right_atlas.json');

        // CARGA DE LOS ATLAS DEL ENEMIGO
        this.load.atlas('enemy_right_walk','res/enemy_anim/enemy_walk.png',
        'res/enemy_anim/enemy_walk_atlas.json');
        this.load.atlas('enemy_left_walk','res/enemy_anim/enemy_walk_left.png',
        'res/enemy_anim/enemy_walk_left_atlas.json');

        // CARGA DEL ATLAS DE LAS CROCOMONEDAS
        this.load.atlas('crococoins_animation','res/crococoin_anim.png',
        'res/crococoin_anim_atlas.json');

        // CARGA DEL SPRITE SHEET DE LOS ELEMENTOS DEL MAPA
        this.load.spritesheet('tilesSprites','res/Tileset.png',
        { frameWidth: 32, frameHeight: 32 });

        // CARGA DE LOS CLIPS DE AUDIO
        this.load.audio('background_music', ["res/audio/background_music.mp3"]);  // Carga de la música
        this.load.audio('jump_sound', ["res/audio/jump_sound.mp3"]);  // Carga del sonido de salto
        this.load.audio('shoot_sound', ["res/audio/shooting_sound.mp3"]);  // Carga del sonido de disparo
        this.load.audio('enemy_destroyed_sound', ["res/audio/enemy_destroyed_sound.mp3"]);  // Carga del sonido de enemigo destruido
        this.load.audio('player_damaged_sound', ["res/audio/damagedPlayer.mp3"]);  // Carga del sonido de enemigo destruido
        this.load.audio('pickup_coin_sound', ["res/audio/coin.mp3"]);  // Carga del sonido de moneda recogida
        this.load.audio('missing_coin_sound', ["res/audio/missing_coins.mp3"]);  // Carga del sonido de falta de monedas por recoger
        this.load.audio('missing_enemies_sound', ["res/audio/missing_enemies.mp3"]);  // Carga del sonido de falta de enemigos por derrotar
        this.load.audio('goal_reached_sound', ["res/audio/goal_reached.mp3"]);  // Carga del sonido de meta alcanzada

    }

    // MÉTODO DE CREACIÓN DE LA ESCENA
    create()
    {

        // CREACIÓN DEL BACKGROUND
        var bg_1 = this.add.tileSprite(0, 0, windows.width*15, windows.height*4, 'bg-1');
        bg_1.fixedToCamera = true;

        // CREACIÓN DEL PLAYER
        // necesitamos un player
        this.player = new Player(this,100,300);

        // CREACIÓN DEL MAPA Y ADICIÓN DE LOS PATRONES CORRESPONDIENTES
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('Plataformas', 'tiles');

        // ADICIÓN DE LAS LAYER DEL MAPA
        var agua = map.createLayer('Agua', tiles, 0, 0);
        var layer2 = map.createLayer('Fondo', tiles, 0, 0);
        var layer = map.createLayer('Suelo', tiles, 0, 0);

        // SE ESTABLECE UNA COLISIÓN ENTRE EL JUGADOR Y LA CAPA DEL SUELO
        // enable collisions for every tile
        layer.setCollisionByExclusion(-1,true);
        this.physics.add.collider(this.player,layer, this.prueba);

        // SE ACTIVA EL COMPORTAMIENTO DE LA COLISIÓN ENTRE EL AGUA Y EL JUGADOR
        agua.setCollisionByExclusion(-1,true);
        this.physics.add.collider(this.player, agua, this.reinicioNivel, null, this);
        
        // CREACIÓN DEL GRUPO QUE CONTENDRÁ LOS DISPAROS
        this.groupDisparos = this.physics.add.group({});  // Creación del grupo

        // CONFIGURACIÓN DE LA CÁMARA PRINCIPAL DE LA ESCENA
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels,map.heightInPixels);
        
        // MANEJO DE LA CAPA DE OBJETOS
        this.monedas_totales = 0;  // Contador del total de monedas de la escena
        this.objetos = map.getObjectLayer('objetos')['objects'];  // Almacenamiento en un array de todos los objetos
        this.monedas = [];  // Array para almacenar las monedas
        this.trampas = [];  // Array para almacenar las trampas
        this.enemigos = [];  // Array para almacenar los enemigos
        for(var i = 0; i < this.objetos.length; ++i)
        {
            var obj = this.objetos[i];  // Se coge un objeto en cada iteración
            if(obj.gid == 181) // en mi caso la trampa
            {
                // CREACIÓN DE LA TRAMPA
                var trampa = new Trampa(this,obj.x,obj.y);
                trampa.setImmovable();  // La trampa será inmóvil
                this.trampas.push(trampa);  // Se añade la trampa al conjunto de trampas
                this.physics.add.collider(this.player, trampa, this.livesReduce, null, this);  // Comportamiento del chocque entre jugador y trampa
            }
            if(obj.gid == 182) // en mi caso la moneda
            {
                // CREACIÓN DE LA MONEDA
                var moneda = new Moneda(this,obj.x,obj.y);
                this.monedas_totales++;  // Se incrementa el contador de monedas de la escena
                this.monedas.push(moneda);  // Se añade la moneda al conjunto de monedas
                this.physics.add.overlap(moneda, this.player, this.scoreIncrease,null,this);  // Comportamiento del chocque entre jugador y moneda
            }
            if(obj.gid == 184) // en mi caso la meta
            {
                // CREACIÓN DE LA META
                var meta = new Meta(this,obj.x,obj.y-40);
                this.tiempo_de_espera_para_la_meta = this.obtenerMilisegundosActuales();  // Se establece nulo el tiempo de espera para intentar acceder a la meta
                this.tiempo_de_espera_para_el_cambio_de_escena = this.obtenerMilisegundosActuales();  // Se establece nulo el tiempo para el intento de cambio de escena
                this.nivel_completado = false;  // Flag para indicar que se cumplen los requisitos para completar el nivel
                this.physics.add.overlap(meta, this.player, this.metaAlcanzada,null,this);  // Comportamiento del chocque entre jugador y meta
            }
            if(obj.gid == 185)  // en mi caso la info de la meta
            {
                // CREACIÓN DEL SPRITE CON LA INFORMACIÓN DE LA META
                this.add.sprite(obj.x + 12,obj.y - 22,'goal_data');
            }
        }
        this.enemigos_vivos = 0;  // Contador del total de enemigos de la escena
        this.enemigos_map = map.getObjectLayer('enemigos')['objects'];  // Almacenamiento en un array de todos los objetos
        for(var i = 0; i < this.enemigos_map.length; ++i)
        {
            var obj = this.enemigos_map[i];  // Se coge un objeto en cada iteración
            if(obj.gid == 183) // en mi caso el enemigo
            {
                // CREACIÓN DEL ENEMIGO
                var enemigo = new Enemigo(this,obj.x,obj.y-30);
                this.enemigos_vivos++;  // Se incrementa el contador de enemigos de la escena
                this.enemigos.push(enemigo);  // Se añade el enemigo al conjunto de enemigos
                this.physics.add.collider(enemigo,layer);  // Se establece la colisión del enemigo con el suelo
                this.physics.add.overlap(enemigo, this.player,this.livesReduce,null,this);  // Comportamiento del choque entre jugador y enemigo
                this.physics.add.overlap(this.groupDisparos, enemigo, this.eliminarEnemigo, null, this);  // Comportamiento del choque entre disparo y enemigo
                // SE ESTABLECE LA COLISIÓN DEL NUEVO ENEMIGO CON CADA TRAMPA
                var j;
                for(j = 0; j < this.trampas.length; j++) this.physics.add.collider(enemigo, this.trampas[j]);
            }
        }
        

        // CREACIÓN DE SISTEMAS DEL JUEGO
        this.livesSystemCreation();  // Creación del sistema de vidas
        this.scoreSystemCreation();  // Creación del sistema de puntuaciones

        // ADICIÓN DE LOS SONIDOS
        this.background_music = this.sound.add('background_music', {loop: true, volume : 0.1});  // Adición de la música
        this.jumping_sound = this.sound.add('jump_sound', {loop: false, volume : 0.2});  // Adición del sonido de salto
        this.shooting_sound = this.sound.add('shoot_sound', {loop: false, volume : 0.2});  // Adición del sonido de disparo
        this.enemy_destroyed_sound = this.sound.add('enemy_destroyed_sound', {loop: false, volume : 0.2});  // Adición del sonido de enemigo eliminado
        this.player_damaged_sound = this.sound.add('player_damaged_sound', {loop: false, volume : 0.65});  // Adición del sonido de daño recibido
        this.coin_picked_sound = this.sound.add('pickup_coin_sound', {loop: false, volume : 0.2});  // Adición del sonido de moneda recogida
        this.missing_coins_voice = this.sound.add('missing_coin_sound', {loop: false, volume : 0.25});  // Adición de la voz que indica que faltan monedas por recoger
        this.missing_enemies_voice = this.sound.add('missing_enemies_sound', {loop: false, volume : 0.25});  // Adición de la voz que indica que faltan enemigos por derrotar
        this.goal_sound = this.sound.add('goal_reached_sound', {loop: false, volume : 0.2});  // Adición del sonido de la meta

        this.background_music.play();  // Inicio de la música

        /*------------------------*/
        /* PARÁMETROS ALTERABLES */

        this.fade_time = 2000;  // Tiempo de fundido de la pantalla

        /*------------------------*/

    }

    // MÉTODO QUE SE EJECUTA UNA VEZ POR CADA FRAME
    update (time, delta)
    {
       this.player.update(time,delta, this);  // Se habilita el comportamiento del método "update" del jugador
       this.scoreSystemUpdate();  // Se habilita el comportamiento del método "update" del sistema de puntos
       this.livesSystemUpdate();  // Se habilita el comportamiento del método "update" del sistema de vidas
       // SE HABILITA EL COMPORTAMIENTO DEL MÉTODO UPDATE DE CADA MONEDA
       var i;
       for(i = 0; i < this.monedas.length; i++) if(this.monedas[i].scene != null) this.monedas[i].update();
       for(i = 0; i < this.enemigos.length; i++) if(this.enemigos[i].scene != null) this.enemigos[i].update();
       // SE COMPRUEBA PERIÓDICAMENTE EN QUE MOMENTO SE HA COMPLETADO EL NIVEL Y SE PUEDE VOLVER A LA ESCENA DEL MENÚ
       if(this.nivel_completado && this.tiempo_de_espera_para_el_cambio_de_escena < this.obtenerMilisegundosActuales()){
           this.background_music.stop();  // Se para la música
            this.scene.start('IntroScene');  // Se vuelve al menú de inicio
       }
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* MÉTODOS DE LA META  */

    // MÉTODO QUE REGULA EL ACCESO A LA META
    metaAlcanzada(){

        // LA META ES ACCESIBLE CADA TRES SEGUNDOS PARA EVITAR SOLAPAMIENTOS DE COMPORTAMIENTO
        if(this.tiempo_de_espera_para_la_meta < this.obtenerMilisegundosActuales()){

            this.tiempo_de_espera_para_la_meta = this.obtenerMilisegundosActuales() + 3000;  // Se establece el tiempo de espera de tres segundos

            // SE COMPRUEBA QUE SE CUMPLAN LOS REQUISITOS DE ACCESO A LA META Y SE INFORMA DE LA SITUACIÓN
            if(this.enemigos_vivos > 0 || this.score < this.monedas_totales){
                if(this.enemigos_vivos > 0) this.missing_enemies_voice.play();
                else if(this.score < this.monedas_totales) this.missing_coins_voice.play();
            }

            // SE ACTIVA EL SONIDO DE LA META, SE ESTABLECE EL TIEMPO DE CAMBIO DE ESCENA, SE INDICA QUE SE HA COMPLETEADO EL NIVEL Y SE INICIA EL FUNDIDO A NEGRO
            else{
                this.goal_sound.play();
                this.tiempo_de_espera_para_el_cambio_de_escena = this.obtenerMilisegundosActuales() + this.fade_time;
                this.nivel_completado = true;  // Se indica que el nivel se ha superado
                this.cameras.main.fadeOut(this.fade_time);  // Se inicia el fundido a negro de la escena
            }

        }

    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* MÉTODOS DE LOS DISPAROS  */

    // MÉTODO PARA AÑADIR LOS DISPAROS AL GRUPO
    aniadirDisparo(){

        this.groupDisparos.add(this.player.disparo);  // Se añade el disparo al grupo

        // SE ESTABLECE EL SENTIDO Y VELOCIDAD DEL DISPARO EN FUNCIÓN DEL SENTIDO DEL JUGADOR
        if(this.player.is_right_not_left) this.groupDisparos.setVelocityX(this.player.disparo.velocidadDisparo);
        else  this.groupDisparos.setVelocityX(-this.player.disparo.velocidadDisparo);

        this.player.disparoActivo = false;  // Se indica que el disparo ya no está activo

    }

    // MÉTODO PARA CONTROLAR EL COMPORTAMIENTO AL ELIMINAR A UN ENEMIGO
    eliminarEnemigo(sprite1,sprite2){

        this.enemy_destroyed_sound.play();  // Suena el sonido de eliminación de un enemigo

        // SE DESTRUYE TANTO EL DISPARO COMO EL ENEMIGO
        sprite1.destroy();
        sprite2.destroy();

        this.enemigos_vivos--; // Se reduce el número de enemigos de la escena

        console.log("enemigo eliminado");  // Mensaje de depuración por consola

    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* MÉTODOS DEL SISTEMA DE VIDAS  */

    // MÉTODO PARA CREAR EL SISTEMA DE VIDAS
    livesSystemCreation(){

        this.lives = 3;  // Se establece el número inicial de vidas

        // SE AÑADE LA IMAGEN DE LAS VIDAS EN LA UI
        this.vidas_UI = this.add.sprite(25, 25, "UIlives_image");

        // SE ESTABLECEN LOS VALORES INICIALES DEL TEXTO
        this.livesText = this.add.text(50, 15, this.lives, { 
            fontSize: '20px', 
            fill: '#fff', 
            fontFamily: 'verdana, arial, sans-serif' 
          });

    }

    // MÉTODO PARA MOVER EL SISTEMA DE VIDAS CON LA PANTALLA
    livesSystemUpdate(){
        this.vidas_UI.x = this.cameras.main.worldView.x + 25;  // Se activa el movimiento automático de la imagen de vidas de la UI con la cámara
        this.livesText.x = this.cameras.main.worldView.x + 50;  // Se activa el movimiento automático del sistema de vidas con la cámara
    }

    // MÉTODO PARA REINICIAR EL NIVEL
    reinicioNivel(){

        this.player_damaged_sound.play();  // Suena el sonido de daño del jugador
        this.background_music.stop();  // Se para la música

        this.scene.restart();  // Se reinicia la escena

        console.log("reiniciando nivel...");    // Mensaje de depuración por consola

    }

    // MÉTODO PARA REDUCIR LAS VIDAS AL CHOCAR CON UN ENEMIGO
    livesReduce(sprite1, sprite2){

        // SI HA PASADO EL TIEMPO EN EL QUE EL JUGADOR ES INMUNE
        if(this.player.tiempoInmune<=0){

            this.lives--;  // Se reduce una vida
            this.livesText.text = this.lives;  // Se actualiza el texto con el número de vidas

            this.player.tiempoInmune=150;  // Se reinicia el tiempo en el que el jugador es inmune

            // SI EL JUGADOR SE HA QUEDADO SIN VIDAS SE REINICIA EL NIVEL, SI NO SUENA EL AUDIO DE DAÑO DEL JUGADOR
            if(this.lives<=0){
                this.reinicioNivel();
            }
            else this.player_damaged_sound.play();

        }
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* MÉTODOS DEL SISTEMA DE PUNTUACIÓN */

    // MÉTODO PARA CREAR EL SISTEMA DE PUNTUACIÓN
    scoreSystemCreation(){

        this.score = 0;  // Se establece la puntuación inicial

        // SE AÑADE LA IMAGEN DE LAS CROCOMONEDAS EN LA UI
        this.crococoins_UI = this.add.sprite(760, 25, "UIcrococoin_image");

        // SE ESTABLECEN LOS VALORES INICIALES DEL TEXTO
        this.scoreText = this.add.text(775, 15, this.score, { 
            fontSize: '20px', 
            fill: '#fff', 
            fontFamily: 'verdana, arial, sans-serif'
          });

    }

    // MÉTODO PARA ACTUALIZAR EL SISTEMA DE PUNTUACIÓN EN CADA FRAME
    scoreSystemUpdate(){
        this.crococoins_UI.x = this.cameras.main.worldView.x + 760;  // Se activa el movimiento automático de la imagen de crocomonedas de la UI con la cámara
        this.scoreText.x = this.cameras.main.worldView.x + 775;  // Se activa el movimiento automático del sistema de puntuación con la cámara
    }

    // MÉTODO PARA INCREMENTAR LA PUNTUACIÓN AL RECOGER UN OBJETO
    scoreIncrease(sprite1, sprite2){

        this.score++;  // Se incrementa la puntuación
        this.scoreText.text = this.score;  // Se actualiza el texto con la puntuación
        sprite1.destroy();  // Se destruye el objeto

        this.coin_picked_sound.play();  // Suena el sonido de moneda recogida

    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* MÉTODOS AUXILIARES */

    // MÉTODO AUXILIAR PARA OBTENER EL TIEMPO EN MILISEGUNDOS Y ELABORAR CONTADORES
    obtenerMilisegundosActuales(){
        var fecha_actual = new Date();  // Obtenemos la fecha actual
        var milisegundos_actuales = fecha_actual.getTime();  // Obtenemos los milisegundos desde las 00:00 del 1 de Enero de 1970 hasta ahora
        return milisegundos_actuales;  // Devolvemos los milisegundos
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

}

/*-----------------------------------------------------------------------------------------------------------------------------*/