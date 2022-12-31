/* SCRIPT QUE ALMACENA LA INFORMACIÓN DE LA META  */
/*-----------------------------------------------------------------------------------------------------------------------------*/

/* CLASE DE LA META */
class Meta extends Phaser.Physics.Arcade.Sprite
{

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* CONSTRUCTOR */
    constructor(scene,x,y)
    {

        super(scene,x+16,y-16,'goal');  // Llamada al constructor "super" con los parámetros de escena, posición y clave de la textura

        this.scene = scene;  // Adición de la escena en la que se localizará la meta como parámetro

        // INCORPORACIÓN DE LA META A LA ESCENA LÓGICA Y A LA ESCENA FÍSICA
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.allowGravity = false;  // Se deshabilita la gravedad
        
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

}

/*-----------------------------------------------------------------------------------------------------------------------------*/