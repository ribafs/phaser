/* SCRIPT QUE ALMACENA LA INFORMACIÓN DE UNA TRAMPA  */
/*-----------------------------------------------------------------------------------------------------------------------------*/

/* CLASE DE LA TRAMPA */
class Trampa extends Phaser.Physics.Arcade.Sprite
{

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* CONSTRUCTOR */
    constructor(scene,x,y)
    {

        super(scene,x+16,y-16,'tilesTrampas');  // Llamada al constructor "super" con los parámetros de escena, posición y clave de la textura

        this.scene = scene;  // Adición de la escena en la que se localizará la trampa como parámetro

        // INCORPORACIÓN DE LA TRAMPA A LA ESCENA LÓGICA Y A LA ESCENA FÍSICA
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.allowGravity = false;  // Se deshabilita la gravedad
        
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

}

/*-----------------------------------------------------------------------------------------------------------------------------*/