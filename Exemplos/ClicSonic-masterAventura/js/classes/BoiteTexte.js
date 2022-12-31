var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BoiteTexte = /** @class */ (function (_super) {
    __extends(BoiteTexte, _super);
    function BoiteTexte($texte, $sceneToAttach, $centre, $x, $y, $largeur, $hauteur, $nomFond) {
        if ($centre === void 0) { $centre = true; }
        if ($nomFond === void 0) { $nomFond = "noir"; }
        var _this = _super.call(this, $sceneToAttach, $x, $y, $largeur, $hauteur, $nomFond) || this;
        _this.texte = $texte;
        _this.centre = $centre;
        return _this;
    }
    BoiteTexte.prototype.creerEtAfficher = function () {
        _super.prototype.creerEtAfficher.call(this);
        if (this.centre)
            this.conteneurTexte = this.sceneToAttach.add.text(this.x + this.largeur / 2, this.y + this.hauteur / 2, this.texte, { fontSize: '27px', fill: '#fff' }).setOrigin(0.5);
        else
            this.conteneurTexte = this.sceneToAttach.add.text(this.x + 20, this.y + 10, this.texte, { fontSize: '27px', fill: '#fff' });
    };
    BoiteTexte.prototype.fermer = function () {
        _super.prototype.fermer.call(this);
        this.conteneurTexte.destroy();
    };
    BoiteTexte.prototype.getTexte = function () {
        return this.texte;
    };
    BoiteTexte.prototype.setTexte = function (value) {
        this.texte = value;
        this.conteneurTexte.setText(this.texte);
    };
    return BoiteTexte;
}(BoiteAffichage));
/* UTILISATION

Necessité d'avoir preload un fond en tant qu'image

Dans un "create" de scene :

this.ajoutDialogues(Main);

Dans une fonction de la scene :

ajoutDialogues: function(scene) {

        this.boite1 = new BoiteTexte("Message 1", this);
        this.boite1.creerEtAfficher();

        this.compteurDialogue = 1;

        this.boite1.getZoneReaction().on('pointerdown', function (pointer) {
            switch(scene.compteurDialogue)
            {
                case 1 :
                    scene.boite1.setTexte("Deuxieme Message");
                    break;
                case 2 :
                    scene.boite1.setTexte("Message le 3e");
                    break;
            }
            scene.compteurDialogue++;
        });
        
    }

  */ 
