var SpaceHipster = SpaceHipster || {};

SpaceHipster.Enemy = function(game, x, y, key, health, enemyBullets) {

    Phaser.Sprite.call(this, game, x, y, key);

    this.game = game;
    //  this.game.physics.arcade.enable(this);

    this.animations.add('getHit', [0, 1, 2, 1, 0], 25, false);
    this.anchor.setTo(0.5);
    this.health = health;

    this.enemyBullets = enemyBullets;


    //create timer
    this.enemyTimer = this.game.time.create(false);
    this.enemyTimer.start();
    this.scheduleShooting();
}

SpaceHipster.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
SpaceHipster.Enemy.prototype.constructor = SpaceHipster.Enemy;

SpaceHipster.Enemy.prototype.update = function() {

    //köşelerden sektirme
    if (this.x < 0.05 * this.game.world.width) {
        this.x = 0.05 * this.game.world.width + 2;
        this.body.velocity.x *= -1;
    } else if (this.x > 0.95 * this.game.world.width) {
        this.x = 0.95 * this.game.world.width - 2;
        this.body.velocity.x *= -1;
    }

    if (this.top > this.game.world.height) {
        this.kill();
    }
}

SpaceHipster.Enemy.prototype.damage = function(amount) {

    Phaser.Sprite.prototype.damage.call(this, amount);

    //play "getting hit" animation
    this.play('getHit');


    //düşman öldürüldüğünde yok edilme efecti uygulandı.
    //particle 
    if (this.health <= 0) {
        var emitter = this.game.add.emitter(this.x, this.y, 100); //konum ve kaç tane parcacık olduğunu gösterir
        emitter.makeParticles("enemyParticle"); //parcacık için image adı
        emitter.minParticleSpeed.setTo(-200, -200); //x,y
        emitter.maxParticleSpeed.setTo(200, 200); //x,y
        emitter.gravity = 0; //yer çekimi

        //https://phaser.io/docs/2.6.2/Phaser.Particles.Arcade.Emitter.html#start
        emitter.start(true, 500, null, 100); //patlama olsun mu,patlama süresi,


        this.enemyTimer.pause();

    }
}


//Phaser reset metodunu özelleştirme vs eklemeler yapma.
SpaceHipster.Enemy.prototype.reset = function(x, y, health, key, scale, speedX, speedY) {
    Phaser.Sprite.prototype.reset.call(this, x, y, health);
    this.loadTexture(key);
    this.scale.setTo(scale);
    this.body.velocity.x = speedX;
    this.body.velocity.y = speedY;

    this.enemyTimer.resume();
}


SpaceHipster.Enemy.prototype.scheduleShooting = function() {
    this.shoot(); //ateş etme


    //her iki saniye de bir mermi oluşturma
    this.enemyTimer.add(Phaser.Timer.SECOND * 2, this.scheduleShooting, this);
}


//Mermi oluşturma
SpaceHipster.Enemy.prototype.shoot = function() {
    var bullet = this.enemyBullets.getFirstExists(false);

    if (!bullet) {
        bullet = new SpaceHipster.EnemyBullet(this.game, this.x, this.bottom)
        this.enemyBullets.add(bullet);
    } else {
        bullet.reset(this.x, this.bottom);
    }
    bullet.body.velocity.y = 100;
}