//this game will have only 1 state
var GameState = {

    init: function() {
        //Klavye tuşları
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //Hız
        this.RUNNING_SPEED = 180;
        this.JUMPING_SPEED = 550;
    },

    //executed after everything is loaded
    create: function() {

        this.ground = this.add.sprite(0, 638, 'ground');
        this.game.physics.arcade.enable(this.ground); //one object(physics) tekli nesneler için kullanılan
        this.ground.body.allowGravity = false; //aşağı gitmesini engelle(yer çekimi)
        this.ground.body.immovable = true; //carpışmada hareketsiz bırakma(iki nesnenin carpismasi)


        //parse json file
        this.levelData = JSON.parse(this.game.cache.getText('level'));

        //create platforms
        this.platforms = this.add.group();
        this.platforms.enableBody = true; //multiple object(physics):çoklu nesneler için kullanılan

        this.levelData.platformData.forEach(platform => {
            this.platforms.create(platform.x, platform.y, 'platform');
        });
        this.platforms.setAll('body.allowGravity', false);
        this.platforms.setAll('body.immovable', true);

        //create fires
        this.fires = this.add.group();
        this.fires.enableBody = true;
        this.levelData.fireData.forEach(fire => {
            var fire = this.fires.create(fire.x, fire.y, 'fire');
            fire.animations.add('fire', [0, 1], 4, true);
            fire.play('fire');
        })
        this.fires.setAll('body.allowGravity', false);

        //create goal
        this.goal = this.game.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
        this.game.physics.arcade.enable(this.goal); //one object(physics)
        this.goal.body.allowGravity = false;


        //create player
        this.player = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'player', 3); //default frame:3
        this.player.anchor.setTo(0.5);
        this.player.animations.add('walking', [0, 1, 2, 1], 6, true);
        this.game.physics.arcade.enable(this.player);
        this.player.customParams = {};

        this.player.body.collideWorldBounds = true; //Ekran dısına taşmayı engelle  

        //Kamera takip etme.
        this.game.camera.follow(this.player);


        this.createOnScreenControls();

        //create barrels
        this.barrels = this.add.group();
        this.barrels.enableBody = true;

        //create barrels in specific seconds
        this.createBarrel();
        this.barrelCreator = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.barrelFrequency, this.createBarrel, this)
    },
    update: function() {



        //Collide Object
        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.collide(this.player, this.platforms);

        this.game.physics.arcade.collide(this.barrels, this.ground);
        this.game.physics.arcade.collide(this.barrels, this.platforms);

        this.game.physics.arcade.overlap(this.player, this.fires, this.gameOver);
        this.game.physics.arcade.overlap(this.player, this.goal, this.win);
        this.game.physics.arcade.overlap(this.player, this.barrels, this.gameOver);


        //hız
        this.player.body.velocity.x = 0;
        // Keyboard 
        if (this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
            this.player.body.velocity.x -= this.RUNNING_SPEED;
            this.player.play('walking');
        } else if (this.cursors.right.isDown || this.player.customParams.isMovingRight) {
            this.player.body.velocity.x += this.RUNNING_SPEED;
            this.player.play('walking');
            this.player.scale.setTo(-1, 1); //oyuncu yönünü değiştirme
        } else {
            this.player.animations.stop();
            this.player.frame = 3;
            this.player.scale.setTo(1, 1); //varsayılan yön
        }


        if ((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) { //zeminde ise-> touching.down
            this.player.body.velocity.y = -this.JUMPING_SPEED;
            this.player.customParams.mustJump = false;
        }

        this.barrels.forEach(barrel => {
            if (barrel.x < 10 && barrel.y > 600) {
                barrel.kill();
            }
        })

    },
    createOnScreenControls: function() {
        this.leftArrow = this.add.button(50, 560, 'arrowButton');
        this.leftArrow.angle = 180;
        this.leftArrow.anchor.setTo(0.5);

        this.rightArrow = this.add.button(110, 560, 'arrowButton');
        this.rightArrow.angle = 0;
        this.rightArrow.anchor.setTo(0.5);

        this.actionButton = this.add.button(280, 560, 'arrowButton');
        this.actionButton.angle = 270;
        this.actionButton.anchor.setTo(0.5);


        this.leftArrow.alpha = 0.5;
        this.rightArrow.alpha = 0.5;
        this.actionButton.alpha = 0.5;

        //Fixed Controls Button in Screen
        this.leftArrow.fixedToCamera = true;
        this.rightArrow.fixedToCamera = true;
        this.actionButton.fixedToCamera = true;

        //Action Button
        this.actionButton.events.onInputDown.add(() => {
            this.player.customParams.mustJump = true;
        }, this);

        this.actionButton.events.onInputUp.add(() => {
            this.player.customParams.mustJump = false;
        }, this);


        //Left Arrow
        this.leftArrow.events.onInputDown.add(() => {
            this.player.customParams.isMovingLeft = true;
        }, this);
        this.leftArrow.events.onInputUp.add(() => {
            this.player.customParams.isMovingLeft = false;
        }, this);

        //HOVER
        this.leftArrow.events.onInputOver.add(() => {
            this.player.customParams.isMovingLeft = true;
        }, this);
        this.leftArrow.events.onInputOut.add(() => {
            this.player.customParams.isMovingLeft = false;
        }, this);



        //Right Arrow
        this.rightArrow.events.onInputDown.add(() => {
            this.player.customParams.isMovingRight = true;
        }, this);

        this.rightArrow.events.onInputUp.add(() => {
            this.player.customParams.isMovingRight = false;
        }, this);

        this.rightArrow.events.onInputOver.add(() => {
            this.player.customParams.isMovingRight = true;
        }, this);
        this.rightArrow.events.onInputOut.add(() => {
            this.player.customParams.isMovingRight = false;
        }, this);


    },
    createBarrel: function() {
        //give me the first dead sprite

        //varil yoksa ,yeniden oluştur
        var barrel = this.barrels.getFirstExists(false);

        //varil yoksa ,yeniden oluştur
        if (!barrel) {
            barrel = this.barrels.create(0, 0, 'barrel');
        }

        //Ekran kenarlarına değme durumları
        barrel.body.collideWorldBounds = true; //Ekrana değme durumunu aktifleştir.
        barrel.body.bounce.set(1, 0); //kenara değdiğinde ters yönde git.

        barrel.reset(this.levelData.goal.x + 20, this.levelData.goal.y); //barrel new position
        barrel.body.velocity.x = this.levelData.barrelSpeed; //Barrel speed
    },

    win: function(player, goal) {
        alert("win");
        game.state.start('GameState');
    },
    gameOver: function() {
        setTimeout(() => {
            game.state.start('HomeState', true, false, 'GAME OVER!');
        }, 250);
    },

};