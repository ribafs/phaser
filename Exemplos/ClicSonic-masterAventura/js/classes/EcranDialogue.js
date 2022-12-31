//La variable "game" est déclarée globale dans BoiteAffichage
var EcranDialogue = /** @class */ (function () {
    function EcranDialogue($texte, $sceneToAttach, $nomIconeParleur, $nomFond) {
        if ($nomFond === void 0) { $nomFond = "noir"; }
        this.largeur = game.config.width * 0.9;
        this.hauteur = game.config.height * 0.5;
        this.texte = ajoutRetoursChariot($texte);
        this.sceneToAttach = $sceneToAttach;
        this.nomIconeParleur = $nomIconeParleur;
        this.nomFond = $nomFond;
    }
    EcranDialogue.prototype.creerEtAfficher = function () {
        this.boiteAffichage = new BoiteAffichage(this.sceneToAttach, 50, 50, this.largeur, this.hauteur, this.nomFond);
        this.boiteAffichage.creerEtAfficher();
        this.conteneurIcone = this.sceneToAttach.add.sprite(150, 150, this.nomIconeParleur).setOrigin(0.5);
        this.conteneurTexte = this.sceneToAttach.add.text(100 + (this.largeur / 2), 150, this.texte, { fontSize: '27px', fill: '#fff' }).setOrigin(0.5);
    };
    EcranDialogue.prototype.setDialogue = function (texte, icone) {
        this.texte = ajoutRetoursChariot(texte);
        this.nomIconeParleur = icone;
        this.conteneurTexte.setText(this.texte);
        this.conteneurIcone.setTexture(this.nomIconeParleur);
    };
    EcranDialogue.prototype.getZoneReaction = function () {
        return this.boiteAffichage.getZoneReaction();
    };
    EcranDialogue.prototype.fermer = function () {
        this.conteneurIcone.destroy();
        this.conteneurTexte.destroy();
        this.boiteAffichage.fermer();
    };
    return EcranDialogue;
}());
