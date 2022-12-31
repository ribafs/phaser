/* SCRIPT QUE ALMACENA LA INFORMACIÓN DE UNA MONEDA  */
/*-----------------------------------------------------------------------------------------------------------------------------*/

/* CLASE DE LA MONEDA */
class Moneda extends Phaser.Physics.Arcade.Sprite
{

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* CONSTRUCTOR */
    constructor(scene,x,y)
    {
        super(scene,x+16,y-16,'UIcrococoin_image');  // Llamada al constructor "super" con los parámetros de escena, posición y clave de la textura

        this.scene = scene;  // Adición de la escena en la que se localizará la moneda como parámetro

        // INCORPORACIÓN DE LA MONEDA A LA ESCENA LÓGICA Y A LA ESCENA FÍSICA
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.allowGravity = false;  // Se deshabilita la gravedad de la moneda

        /*------------------------*/
        /* ASINGACIÓN DE ANIMACIONES */

        // ANIMACIÓN DE LA MONEDA
        this.anims.create({
            key: 'coinAnim',
            frames: this.scene.anims.generateFrameNames('crococoins_animation', { start: 1, end: 8, prefix: 'crococoin'}),
            frameRate: 8,
            repeat: -1
        });

        /*------------------------*/
        
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* MÉTODOS BÁSICOS DE LA ESCENA */

    // MÉTODO QUE SE EJECUTA UNA VEZ POR CADA FRAME
    update(time,delta)
    {
        this.play('coinAnim', true);  // La animación de la moneda se ejecuta constantemente
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

}

/*-----------------------------------------------------------------------------------------------------------------------------*/