var BoiteAffichage = /** @class */ (function () {
    function BoiteAffichage($sceneToAttach, $x, $y, $largeur, $hauteur, $nomFond) {
        if ($x === void 0) { $x = game.config.width * 0.5 - 150; }
        if ($y === void 0) { $y = game.config.height * 0.2 - 50; }
        if ($largeur === void 0) { $largeur = 300; }
        if ($hauteur === void 0) { $hauteur = 100; }
        if ($nomFond === void 0) { $nomFond = "noir"; }
        this.sceneToAttach = $sceneToAttach;
        this.x = $x;
        this.y = $y;
        this.largeur = $largeur;
        this.hauteur = $hauteur;
        this.nomFond = $nomFond;
    }
    BoiteAffichage.prototype.creerEtAfficher = function () {
        this.zoneReaction = this.sceneToAttach.add.sprite(this.x + this.largeur / 2, this.y + this.hauteur / 2, this.nomFond).setOrigin(0.5).setInteractive();
        this.zoneReaction.displayWidth = this.largeur;
        this.zoneReaction.displayHeight = this.hauteur;
    };
    BoiteAffichage.prototype.fermer = function () {
        this.zoneReaction.destroy();
    };
    BoiteAffichage.prototype.getZoneReaction = function () {
        return this.zoneReaction;
    };
    return BoiteAffichage;
}());
