class Beam extends Phaser.GameObjects.Sprite {

	constructor(scene) { // We need a referance to scene in the constructor.

		var x = scene.player.x;
		var y = scene.player.y;

		super(scene, x, y, "beam");

		// Add GameObject to scene
		scene.add.existing(this);

		
		this.play("beam_anim");  // Play Animation
		scene.physics.world.enableBody(this); // Enabling Spritesheet to have physics
		this.body.velocity.y = -250; // Setting velocity of Beam to go upwards

		// Add this "beam" instance to projectiles group  defined in create() of Scene2.
		scene.projectiles.add(this);

	}

	update() {

		// To destroy the Beam object once it gets out of screen.
		// Otherwise a lot of Beam objects will accumulate and cause performance issues.
		if(this.y < 32) {
			this.destroy();
		}
	}
}