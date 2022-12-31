/* SCRIPT QUE CONTROLA EL FUNCIONAMIENTO DE LA ESCENA DEL MENÚ */
/*-----------------------------------------------------------------------------------------------------------------------------*/

/* CLASE DE LA ESCENA */
class IntroScene extends Phaser.Scene
{

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* CONSTRUCTOR */
    constructor(){
        super('IntroScene');  // Se le asigna el nombre a la escena
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* MÉTODOS BÁSICOS DE LA ESCENA */

    // MÉTODO DE PRECARGA DE LA ESCENA
    preload()
    {

        // CARGA DE LA IMAGEN DEL MENÚ
        this.load.image('menu_image', 'res/MainScreen.png');

        // CARGA DEL AUDIO
        this.load.audio('start_game_sound_effect', ["res/audio/start_game.mp3"]);  // Adición del sonido de "start"

    }

    // MÉTODO DE CREACIÓN DE LA ESCENA
    create()
    {

        /*------------------------*/
        /* PARÁMETROS ALTERABLES */

        this.fade_time = 2000;  // Tiempo de fundido de la pantalla

        /*------------------------*/

        // FLAGS DE LA ESCENA
        this.can_press_enter = true;  // Flag para habilitar el pulsado de la tecla "Enter"
        this.can_change_scene = false;  // Flag para habilitar el de cambio de escena

        // CREACIÓN DE LA IMAGEN DE FONDO
        var background_image = this.add.tileSprite(0, 0, windows.width*2, windows.height*2, 'menu_image');
        background_image.fixedToCamera = true;

        this.start_game_sound_effect = this.sound.add('start_game_sound_effect', {loop: false, volume : 0.25});  // Adición del efecto de sonido del cambio de escena
        this.keyEnter = this.input.keyboard.addKey("ENTER");  // Se habilita la lectura de la tecla "Enter".

        this.cameras.main.fadeIn(this.fade_time);  // Fundido desde negro de la escena

    }

    // MÉTODO QUE SE EJECUTA UNA VEZ POR CADA FRAME
    update (time, delta)
    {

        // SI SE PUEDE PULSAR ENTER Y SE PULSA
        if(this.can_press_enter && this.keyEnter.isDown){

            this.start_game_sound_effect.play();  // Se inicia el sonido de cambio de ecena

            this.can_press_enter = false;  // Se prohibe pulsar "Enter" de nuevo.
            this.can_change_scene = true;  // Se permite el cambio de escena

            this.change_scene_timer = this.obtenerMilisegundosActuales() + this.fade_time;  // Se calcula el tiempo para el cambio de escena

            this.cameras.main.fadeOut(this.fade_time);  // Se inicia el fundido a negro de la escena

        }

        // SI EL CAMBIO DE ESCENA ESTÁ PERMITIDO Y HA PASADO EL TIEMPO DE FUNDIDO
        if(this.can_change_scene && this.change_scene_timer < this.obtenerMilisegundosActuales()) this.scene.start('MainScene');  // Se cambia de escena

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