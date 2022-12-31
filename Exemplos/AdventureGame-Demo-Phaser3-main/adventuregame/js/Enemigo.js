/* SCRIPT QUE ALMACENA LA INFORMACIÓN DE UN ENEMIGO  */
/*-----------------------------------------------------------------------------------------------------------------------------*/

class Enemigo extends Phaser.Physics.Arcade.Sprite
{

/*-----------------------------------------------------------------------------------------------------------------------------*/

    /* CONSTRUCTOR */
    constructor(scene,x,y)
    {

        super(scene,x,y,'enemy');  // Llamada al constructor "super" con los parámetros de escena, posición y clave de la textura

        this.scene = scene;  // Adición de la escena en la que se localizará el enemigo como parámetro

        // INCORPORACIÓN DEL ENEMIGO A LA ESCENA LÓGICA Y A LA ESCENA FÍSICA
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.allowGravity = false;  // Se habilita la gravedad del enemigo

        /*------------------------*/
        /* ASINGACIÓN DE ANIMACIONES */

        // CAMINAR HACIA LA DERECHA
        this.anims.create({
            key: 'walkRight',
            frames: this.scene.anims.generateFrameNames('enemy_right_walk', { start: 1, end: 8, prefix: 'enemy_walk'}),
            frameRate: 8,
            repeat: -1
        });

        // CAMINAR HACIA LA IZQUIERDA
        this.anims.create({
            key: 'walkLeft',
            frames: this.scene.anims.generateFrameNames('enemy_left_walk', { start: 1, end: 8, prefix: 'enemy_walk_left'}),
            frameRate: 8,
            repeat: -1
        });

        /*------------------------*/
        /*------------------------*/
        /* PARÁMETROS ALTERABLES */

        this.velocidad = 20;  // Velocidad del enemigo

        /*------------------------*/
        
        this.setVelocityX(this.velocidad);  // Se establece la velocidad en el eje X
        
    }

/*-----------------------------------------------------------------------------------------------------------------------------*/


    /* FUNCIÓN UPDATE QUE SE EJECUTA EN CADA FRAME AL SER LLAMADA DESDE EL UPDATE DE LA ESCENA */
    update(time,delta)
    {

        // SI EL ENEMIGO CHOCA CON UNA PARED, EL ENEMIGO CAMINA EN EL SENTIDO CONTRARIO
        if(this.body.velocity.x == 0){
            this.velocidad=this.velocidad*-1;
            this.setVelocityX(this.velocidad);
        }

        /*------------------------*/
        /* SE ESTABLECE LA ANIMACIÓN CORRECTA EN CADA FRAME */

        // CAMINAR HACIA LA DERECHA
        if(this.body.velocity.x > 0){
            this.play('walkRight', true);
        }

        // CAMINAR HACIA LA IZQUIERDA
        else { 
            this.play('walkLeft', true);
        }

        /*------------------------*/

    }

/*-----------------------------------------------------------------------------------------------------------------------------*/

}

/*-----------------------------------------------------------------------------------------------------------------------------*/