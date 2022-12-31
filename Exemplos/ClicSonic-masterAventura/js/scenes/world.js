var World = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function World() {
            Phaser.Scene.call(this, { key: 'World' });
        },

    preload: function () {
    },

    create: function () {

        World = this.scene.get("World");

        if (!fromInit)
            manageMusic('worldMenu');
        else
            fromInit = false;

        this.worldBackground = this.add.sprite(0, 0, 'fondWorld').setOrigin(0, 0);

        this.scenario();

    },

    scenario: function () {

        this.compteurDialogue = 1;

        if (levels.get("Tails").complete === false) {
            this.dialogue = new EcranDialogue("Haaaaa. Doux réveil.", this, "sonic");
            this.dialogue.creerEtAfficher();
            this.dialogue.getZoneReaction().on('pointerdown', function (pointer) {
                switch (World.compteurDialogue) {
                    case 1:
                        World.dialogue.setDialogue("Ca fait longtemps que Dr Robotnik et compagnie n'agissent pas.", "sonic");
                        break;
                    case 2:
                        World.dialogue.setDialogue("C'est plutôt une bonne nouvelle mais j'ai un mauvais présentiment.", "sonic");
                        break;
                    case 3:
                        World.dialogue.setDialogue("Je vais aller chercher les autres pour se tenir prets. Au cas où...", "sonic");
                        break;
                    case 4:
                        World.dialogue.fermer();
                        World.launchingWorld();
                        break;
                }
                World.compteurDialogue++;
            });
        }
        else if (levels.get("Tails").complete === true && levels.get("Knuckles").complete === false) {
            this.dialogue = new EcranDialogue("Super ! Allons chercher Knuckles maintenant !", this, "sonic");
            this.dialogue.creerEtAfficher();
            this.dialogue.getZoneReaction().on('pointerdown', function (pointer) {
                World.dialogue.fermer();
                World.launchingWorld();
            });
        }
        else if (levels.get("Knuckles").complete === true) {
            this.dialogue = new EcranDialogue("Bon, on est là, il se passe quoi du coup ?", this, "knuckles");
            this.dialogue.creerEtAfficher();
            this.dialogue.getZoneReaction().on('pointerdown', function (pointer) {
                switch (World.compteurDialogue) {
                    case 1:
                        World.dialogue.setDialogue("Peut être rien, je voulais être sur que votre matériel soit pret et que vous soyez disponibles.", "sonic");
                        break;
                    case 2:
                        World.dialogue.setDialogue("On est jamais trop prudents.", "tails");
                        break;
                    case 3:
                        World.dialogue.setDialogue("Bon, et ben je vais aller faire la sieste alors.", "knuckles");
                        break;
                    case 4:
                        World.dialogue.setDialogue("Attends Knuckles, j'ai l'impression qu'il se passe quelque chose...", "sonic");
                        break;
                    case 5:
                        World.dialogue.setDialogue("HO MON DIEU !", "tails");
                        break;
                    case 6:
                        World.dialogue.fermer();
                        World.launchingWorld();
                        break;
                }
                World.compteurDialogue++;
            });
        }

    },

    launchingWorld: function () {

        this.spriteTails = this.add.sprite(600, 400, 'tails').setOrigin(0.5).setInteractive();
        this.spriteKnuckles = this.add.sprite(200, 400, 'knuckles').setOrigin(0.5).setInteractive();

        //Ajout du texte si pas encore au niveau final
        if (levels.get("Knuckles").complete === false) {
            this.boiteTexte = new BoiteTexte("Rallie tes amis !", this);
            this.boiteTexte.creerEtAfficher();
        }

        //Gestion sprite et action Tails
        if (levels.get("Tails").complete === false) {
            this.spriteTails.on('pointerdown', function (pointer) {

                level = "Tails";

                World.scene.start('Action');
            });
        }
        else {
            this.spriteTails.setTexture("thumbUpTails");
        }

        //Gestion sprite et action knuckles
        if (levels.get("Tails").complete === true && levels.get("Knuckles").complete === false) {
            this.spriteKnuckles.clearTint();
            this.spriteKnuckles.on('pointerdown', function (pointer) {

                level = "Knuckles";

                World.scene.start('Action');
            });
        }
        else if (levels.get("Tails").complete === false) {
            this.spriteKnuckles.setTint(0x696969);
        }
        else {
            this.spriteKnuckles.setTexture("thumbUpKnuckles");
        }

        //Gestion apparition niveau final
        if (levels.get("Knuckles").complete === true) {
            this.timedEvent = this.time.addEvent({ delay: 2500, callback: this.afterAnim, callbackScope: this, loop: false });
            this.finalAnim();
        }

    },

    finalAnim: function () {

        manageMusic('endGame');

        this.fondSombre(1);

        console.log("Animation Finale");

        //TODO :
        //Mettre les 2 nuages et leur mettre une velocity
        //Mettre le sprite de metalsonic derrière
        //Lancer le son de ça bouge
    },

    fondSombre: function (occurence) {

        console.log("occurence :" + occurence);
        color = 0;

        switch (occurence) {
            case 1:
                color = 0xFFCACA;
                break;
            case 2:
                color = 0xFFACAC;
                break;
            case 3:
                color = 0xFF5C5C;
                break;
            case 4:
                color = 0xFF0000;
                break;

        }

        this.worldBackground.setTint(color);

        if (occurence < 4)
            this.time.addEvent({ delay: 500, callback: function () { this.fondSombre(++occurence) }, callbackScope: this });

    },

    afterAnim: function () {
        //TODO :
        //Arréter le son de ça bouge
        //Arréter la velocity des nuages
        //Son de "glong"
        //Rendre niveau metal sonic clickable qui lance la nouvelle scene LastLevel
    }
});