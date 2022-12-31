var GameState = {
    preload: function() {
        this.load.image('background', 'assets/img/background.png');
        this.load.image('arrow', 'assets/img/arrow.png');


        this.load.spritesheet('chicken', 'assets/img/chicken_spritesheet.png', 131, 200, 3); //width,height,frame count
        this.load.spritesheet('horse', 'assets/img/horse_spritesheet.png', 212, 200, 3);
        this.load.spritesheet('pig', 'assets/img/pig_spritesheet.png', 297, 200, 3);
        this.load.spritesheet('sheep', 'assets/img/sheep_spritesheet.png', 244, 200, 3);

        this.load.audio('chickenSound', ['assets/audio/chicken.ogg', 'assets/audio/chicken.mp3']);
        this.load.audio('horseSound', ['assets/audio/horse.ogg', 'assets/audio/horse.mp3']);
        this.load.audio('pigSound', ['assets/audio/pig.ogg', 'assets/audio/pig.mp3']);
        this.load.audio('sheepSound', ['assets/audio/sheep.ogg', 'assets/audio/sheep.mp3']);

    },
    create: function() {

        //Screen Scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;


        this.background = this.game.add.sprite(0, 0, 'background');

        //group for animals
        var animalData = [
            { key: 'chicken', text: 'CHICKEN', audio: 'chickenSound' },
            { key: 'horse', text: 'HORSE', audio: 'horseSound' },
            { key: 'pig', text: 'PIG', audio: 'pigSound' },
            { key: 'sheep', text: 'SHEEP', audio: 'sheepSound' }
        ];

        this.animals = this.game.add.group();
        var self = this;
        var animal;

        animalData.forEach((element) => {
            animal = self.animals.create(-1000, this.game.world.centerY, element.key, 0); // 0 numarası varsayılan ilk acılan görüntüyü belirler.

            console.log(element.text)
            animal.customParams = { text: element.text, sound: self.game.add.audio(element.audio) };

            animal.anchor.setTo(0.5);


            //create animal animation
            animal.animations.add('animate', [0, 1, 2, 1, 0, 1], 3, false);

            animal.inputEnabled = true;
            animal.input.pixelPerfectClick = true;
            animal.events.onInputDown.add(self.animateAnimal, this);
        })

        this.currentAnimal = this.animals.next();
        this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY)

        //show animal text
        this.showText(this.currentAnimal);


        //left arrow
        this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
        this.leftArrow.anchor.setTo(0.5);
        this.leftArrow.scale.setTo(-1);
        this.leftArrow.customParams = { direction: -1 };

        //left arrow allow user input
        this.leftArrow.inputEnabled = true;
        this.leftArrow.input.pixelPerfectClick = true;
        this.leftArrow.events.onInputDown.add(this.switchAnimal, this);


        //right arrow
        this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
        this.rightArrow.anchor.setTo(0.5);
        this.rightArrow.customParams = { direction: 1 };

        //right arrow allow user input
        this.rightArrow.inputEnabled = true;
        this.rightArrow.input.pixelPerfectClick = true;
        this.rightArrow.events.onInputDown.add(this.switchAnimal, this);



    },
    update: function() {

    },
    switchAnimal: function(sprite, event) {
        console.log(this.isMoving)
        if (this.isMoving) {
            return false;
        }
        this.isMoving = true;


        //hide text
        this.animalText.visible = false;


        var newAnimal, endX;


        if (sprite.customParams.direction > 0) {
            newAnimal = this.animals.next();
            newAnimal.x = -newAnimal.width / 2;
            endX = 640 + this.currentAnimal.width / 2;
        } else {

            newAnimal = this.animals.previous();
            newAnimal.x = 640 + newAnimal.width / 2;
            endX = -this.currentAnimal.width / 2;
        }


        //Tween Animation
        var newAnimalMovement = this.game.add.tween(newAnimal);
        newAnimalMovement.to({ x: this.game.world.centerX }, 1000);
        newAnimalMovement.onComplete.add(() => {
            this.isMoving = false;
            this.showText(newAnimal);
        }, this);
        newAnimalMovement.start();

        var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({ x: endX }, 1000);
        currentAnimalMovement.start();
        this.currentAnimal = newAnimal;

    },
    animateAnimal: function(sprite, event) {
        sprite.play('animate'); //play animation
        sprite.customParams.sound.play();

    },
    showText: function(animal) {
        if (!this.animalText) {
            var style = {
                font: 'bold 30pt Arial',
                fill: '#D0171B',
                align: 'center'
            }
            this.animalText = this.game.add.text(this.game.width / 2, this.game.height * 0.85, '', style);
            this.animalText.anchor.setTo(0.5);
        }

        console.log(animal.customParams);
        this.animalText.setText(animal.customParams.text);

        this.animalText.visible = true;
    }
};


var game = new Phaser.Game(640, 360, Phaser.AUTO);
game.state.add('GameState', GameState);
game.state.start('GameState');