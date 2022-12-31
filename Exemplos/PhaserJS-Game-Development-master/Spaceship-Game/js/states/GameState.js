var SpaceHipster = SpaceHipster || {};

SpaceHipster.GameState = {

    //initiate game settings
    init: function(currentLevel) {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.PLAYER_SPEED = 200;
        this.BULLET_SPEED = -1000;


        //level data
        this.numLevels = 3;
        this.currentLevel = currentLevel ? currentLevel : 1;


    },

    //load the game assets before the game starts
    preload: function() {
        this.load.image('space', 'assets/images/space.png');
        this.load.image('player', 'assets/images/player.png');
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('enemyParticle', 'assets/images/enemyParticle.png');
        this.load.spritesheet('yellowEnemy', 'assets/images/yellow_enemy.png', 50, 46, 3, 1, 1);
        this.load.spritesheet('redEnemy', 'assets/images/red_enemy.png', 50, 46, 3, 1, 1);
        this.load.spritesheet('greenEnemy', 'assets/images/green_enemy.png', 50, 46, 3, 1, 1);


        //load level data
        this.load.text('level1', 'assets/data/level1.json');
        this.load.text('level2', 'assets/data/level2.json');
        this.load.text('level3', 'assets/data/level3.json');


        //load audio
        this.load.audio('orchestra', ['assets/audio/8bit-orchestra.mp3', 'assets/audio/8bit-orchestra.ogg']);

    },
    //executed after everything is loaded
    create: function() {

        // background
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space')
        this.background.autoScroll(0, 50); //yatay yönde arkaplan hareket ettirme

        //player
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.height - 50, "player");
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true; //ekran dısına taşmasını engelle


        //initiate player bullets and player shooting
        this.initBullets();
        this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 5, this.createPlayerBullet, this);

        //create enemy
        this.initEnemies();


        //load level
        this.loadLevel();


        this.orchestra = this.add.audio('orchestra');
        this.orchestra.play();

    },
    update: function() {

        //Mermi Düşman çarpışma durumu
        this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, null, this)


        //Düşman mermisinin oyuncuya carpma durumu
        this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.killPlayer, null, this)



        //added left and right touch 
        this.player.body.velocity.x = 0;
        if (this.game.input.activePointer.isDown) {
            var targetX = this.game.input.activePointer.position.x;
            var direction = targetX >= this.game.world.centerX ? 1 : -1;
            this.player.body.velocity.x = direction * this.PLAYER_SPEED;
        }
    },
    //initiate the player bullets group
    initBullets: function() {
        this.playerBullets = this.add.group();
        this.playerBullets.enableBody = true;
    },

    //create or reuse a bullet - pool of objects
    createPlayerBullet: function() {
        var bullet = this.playerBullets.getFirstExists(false);

        //only create a bullet if there are no dead ones available to reuse
        if (!bullet) {
            bullet = new SpaceHipster.PlayerBullet(this.game, this.player.x, this.player.top);
            this.playerBullets.add(bullet);
        } else {
            //reset position
            bullet.reset(this.player.x, this.player.top);
        }

        //set velocity
        bullet.body.velocity.y = this.BULLET_SPEED;
    },
    initEnemies: function() {
        //create enemies
        this.enemies = this.add.group();
        this.enemies.enableBody = true;


        //create enemy bullets
        this.enemyBullets = this.add.group();
        this.enemyBullets.enableBody = true;


    },
    damageEnemy: function(bullet, enemy) {

        //Enerjisi sıfır olduğunda düşman yok olur.  
        enemy.damage(1); //düşmandan enerji al

        bullet.kill();
    },
    killPlayer: function() {
        this.player.kill();
        this.orchestra.stop();
        this.game.state.start('GameState');
    },
    createEnemy: function(x, y, health, key, scale, speedX, speedY) {
        var enemy = this.enemies.getFirstExists(false);
        if (!enemy) {
            enemy = new SpaceHipster.Enemy(this.game, x, y, key, health, this.enemyBullets);
            this.enemies.add(enemy);
        }
        enemy.reset(x, y, health, key, scale, speedX, speedY)

    },
    loadLevel: function() {

        this.currentEnemyIndex = 0;

        //level'e göre level dataları yükleme
        this.levelData = JSON.parse(this.game.cache.getText('level' + this.currentLevel))



        //end of the level timer
        this.endOfLevelTimer()

        //düşmanları sıra ile getirme
        this.scheduleNextEnemy();
    },
    scheduleNextEnemy: function() {
        var nextEnemy = this.levelData.enemies[this.currentEnemyIndex];
        if (nextEnemy) {
            var nextTime = 1000 * (nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex - 1].time))

            this.nextEnemyTimer = this.game.time.events.add(nextTime, function() {
                this.createEnemy(nextEnemy.x * this.game.world.width, -100, nextEnemy.health, nextEnemy.key, nextEnemy.scale, nextEnemy.speedX, nextEnemy.speedY);
                this.currentEnemyIndex++;
                this.scheduleNextEnemy();
            }, this)
        }
    },
    endOfLevelTimer: function() {
        this.game.time.events.add(this.levelData.duration * 1000, () => {
            this.orchestra.stop();
            if (this.currentLevel < this.numLevels) {
                this.currentLevel++;
            } else {
                this.currentLevel = 1;
            }

            this.game.state.start('GameState', true, false, this.currentLevel);
        }, this)
    }

};