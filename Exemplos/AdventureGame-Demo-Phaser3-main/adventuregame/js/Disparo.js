/* SCRIPT QUE ALMACENA LA INFORMACIÓN DE UN DISPARO  */
/*-----------------------------------------------------------------------------------------------------------------------------*/

/* CLASE DEL DISPARO */
class Disparo extends Phaser.Physics.Arcade.Sprite
{

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* CONSTRUCTOR */
    constructor(scene,x,y)
    {

        super(scene,x,y,'disparo');  // Llamada al constructor "super" con los parámetros necesarios

        this.scene = scene;  // Adición de la escena en la que se localizará el disparo como parámetro

        // INCORPORACIÓN DEL DISPARO A LA ESCENA LÓGICA Y A LA ESCENA FÍSICA
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        /*------------------------*/
        /* PARÁMETROS ALTERABLES */

        this.velocidadDisparo = 300;  // Velocidad de la bala

        /*------------------------*/
        
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

}

/*-----------------------------------------------------------------------------------------------------------------------------*/