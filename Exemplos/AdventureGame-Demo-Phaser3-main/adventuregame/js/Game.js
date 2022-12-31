/* SCRIPT QUE CONTROLA LA CONFIGURACIÓN BÁSICA DEL JUEGO */
/*-----------------------------------------------------------------------------------------------------------------------------*/

/* PARÁMETROS DE CONFIGURACIÓN DE LA ESCENA */
var windows = {width:800,height: 480}
var config = {
    type: Phaser.AUTO,
    width: windows.width,
    height: windows.height,
    parent: "canvas",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    scene: [IntroScene, MainScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false,
        }
    }
};

/*-----------------------------------------------------------------------------------------------------------------------------*/

/* CREACIÓN DEL NUEVO JUEGO */
var game = new Phaser.Game(config);

/*-----------------------------------------------------------------------------------------------------------------------------*/

/* REFERENCIAS DE INTERÉS */

//'http://labs.phaser.io'
//'assets/skies/space3.png'
//'assets/sprites/phaser3-logo.png'
//'assets/particles/red.png'

/*-----------------------------------------------------------------------------------------------------------------------------*/
