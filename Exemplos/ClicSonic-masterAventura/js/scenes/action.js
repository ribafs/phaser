var Action = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function Action() {
            Phaser.Scene.call(this, { key: 'Action' });
        },

    preload: function () {
    },

    create: function () {

        Action = this.scene.get("Action");

        this.score = 0;
        this.texte;
        this.perteAccelerationEvent;
        this.spriteSonic;
        this.bar;
        this.maxScore = levels.get(level).maxScore;
        this.dashSounds = [];
        this.end = false;

        manageMusic('puzzles');

        this.add.image(0, 0, 'fond' + level).setOrigin(0, 0);

        this.scenario();
    },

    scenario: function () {

        this.compteurDialogue = 1;

        if (level === "Tails") {
            this.dialogue = new EcranDialogue("Salut Sonic ! Quel bon vent t'amène ?", this, "tails");
            this.dialogue.creerEtAfficher();
            this.dialogue.getZoneReaction().on('pointerdown', function (pointer) {
                switch (Action.compteurDialogue) {
                    case 1:
                        Action.dialogue.setDialogue("Je pense qu'il va y avoir de l'action aujourd'hui.", "sonic");
                        break;
                    case 2:
                        Action.dialogue.setDialogue("J'aimerais que l'on soit prets.", "sonic");
                        break;                    
                    case 3:
                        Action.dialogue.setDialogue("Très bien ! J'aurai juste besoin de ton aide pour finir de réparer ce partionneur à émeraudes.", "tails");
                        break;                    
                    case 4:
                        Action.dialogue.setDialogue("C'est comme si c'était fait !", "sonic");
                        break;
                    case 5:
                        Action.dialogue.fermer();
                        Action.launchingAction();
                        break;
                }
                Action.compteurDialogue++;
            });
        }
        else if (level === "Knuckles") {
            this.dialogue = new EcranDialogue("Salut Sonic.", this, "knuckles");
            this.dialogue.creerEtAfficher();
            this.dialogue.getZoneReaction().on('pointerdown', function (pointer) {
                switch (Action.compteurDialogue) {
                    case 1:
                        Action.dialogue.setDialogue("Salut mec ! Je pense qu'il vaut mieux être sur le qui-vive aujourd'hui.", "sonic");
                        break;
                    case 2:
                        Action.dialogue.setDialogue("Je ne sais pas ce que ça veut dire mais j'aurai besoin de toi pour réparer le socle de la Master Emerald.", "knuckles");
                        break;                    
                    case 3:
                        Action.dialogue.setDialogue("C'est parti !", "sonic");
                        break;                    
                    case 4:
                        Action.dialogue.fermer();
                        Action.launchingAction();
                        break;
                }
                Action.compteurDialogue++;
            });
        }

    },

    launchingAction: function () {

        this.boiteTexte = new BoiteTexte("Clic Sonic !", this);
        this.boiteTexte.creerEtAfficher();
        
        this.bar = new HealthBar(this, 200, 200, 400, 50, this.maxScore);

        this.perteAccelerationEvent = this.time.addEvent({ delay: 1500, callback: this.perteAcceleration, callbackScope: this, loop: true });

        this.spriteSonic = this.add.sprite(400, 400, 'sonic').setOrigin(0.5).setInteractive();

        this.spriteSonic.on('pointerdown', function (pointer) {

            Action.spriteSonic.setTexture("sonicSpin");

            //Premier clic
            if (Action.dashSounds.length == 0) {
                Action.finLevelEvent = Action.time.addEvent({ delay: 2500, callback: Action.finLevel, callbackScope: Action, loop: false });
                music.stop();
                Action.dashSounds[0] = Action.sound.add('spinPrepare');
                Action.dashSounds[0].play();
            }
            else if (Action.dashSounds.length < 3) {
                Action.dashSounds[Action.dashSounds.length] = Action.sound.add('spinPrepare');
                Action.dashSounds[Action.dashSounds.length - 1].play();
            }

            this.setTint(0xff0000);
            Action.score += 10;
            Action.majScore();
            if (Action.score >= Action.maxScore) {
                Action.finLevel();
            }
        });

        this.spriteSonic.on('pointerout', function (pointer) {

            this.clearTint();

        });

        this.spriteSonic.on('pointerup', function (pointer) {

            this.clearTint();

        });


    },

    perteAcceleration: function () {
        this.score -= 30;
        if (this.score <= 0)
            this.score = 0;
        this.majScore();
    },

    majScore: function () {
        console.log(this.score);
        this.bar.newAmount(this.score);
    },

    finLevel: function () {
        this.finalDash = this.sound.add('spinDash');
        this.finalDash.play();

        if (this.score >= (this.maxScore / 2))
            this.end = "victoire";
        else
            this.end = "defaite";

        this.perteAccelerationEvent.remove();
        this.finLevelEvent = this.time.addEvent({ delay: 1000, callback: this.changeScene, callbackScope: this });
        if (this.end == "victoire")
            this.boiteTexte.setTexte('VICTOIRE');
        else
            this.boiteTexte.setTexte('ESSAYE ENCORE !');
        this.spriteSonic.off('pointerdown');
    },

    changeScene: function () {
        if (this.end == "victoire")
            levels.get(level).complete = true;

        Action.scene.start('World');
    }
});