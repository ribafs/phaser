var HomeState = {
    init: function(message) {
        this.message = message;
    },
    create: function() {
        this.game.stage.backgroundColor = '#000';
        game.input.onDown.add(this.changeScreen, this);

        this.ground = this.add.sprite(0, 550, 'ground');
        this.game.physics.arcade.enable(this.ground); //one object(physics) tekli nesneler için kullanılan
        this.ground.body.allowGravity = false; //aşağı gitmesini engelle(yer çekimi)
        this.ground.body.immovable = true; //carpışmada hareketsiz bırakma(iki nesnenin carpismasi)

        //parse json file
        this.levelData = JSON.parse(this.game.cache.getText('level'));

        //create platforms
        this.platforms = this.add.group();
        this.platforms.enableBody = true; //multiple object(physics):çoklu nesneler için kullanılan

        this.levelData.platformData.forEach(platform => {
            this.platforms.create(platform.x, platform.y - 80, 'platform');
        });
        this.platforms.setAll('body.allowGravity', false);
        this.platforms.setAll('body.immovable', true);

        //create fires
        this.fires = this.add.group();
        this.fires.enableBody = true;
        this.levelData.fireData.forEach(fire => {
            var fire = this.fires.create(fire.x, fire.y - 80, 'fire');
        })
        this.fires.setAll('body.allowGravity', false);



        //create goal
        this.goal = this.game.add.sprite(this.levelData.goal.x, this.levelData.goal.y - 80, 'goal');
        this.game.physics.arcade.enable(this.goal); //one object(physics)
        this.goal.body.allowGravity = false;

        //create player
        this.player = this.add.sprite(this.levelData.playerStart.x + 10, this.levelData.playerStart.y - 10, 'player', 3);
        this.player.anchor.setTo(0.5);

        var style = { font: '24px Arial', fill: '#fff' };
        this.game.add.text(40, this.game.world.centerY - 60, 'TOUCH TO START', style);

        if (this.message) {
            this.game.add.text(60, this.game.world.centerY - 90, this.message, style);
        }
    },
    changeScreen() {
        this.state.start('GameState')
    }
}