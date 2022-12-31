function ajoutRetoursChariot(texte, longueur) {
    if (longueur === void 0) { longueur = 16; }
    var tab = texte.split(' ');
    var texteAvecRetoursChariots = "";
    var compteurLettres = 0;
    tab.forEach(function (mot) {
        compteurLettres += mot.length;
        if (compteurLettres <= longueur || mot.length == 1) {
            texteAvecRetoursChariots += " ";
            compteurLettres++;
        }
        else {
            texteAvecRetoursChariots += "\n";
            compteurLettres = 0;
        }
        texteAvecRetoursChariots += mot;
    });
    //Suppression du premier espace.
    texteAvecRetoursChariots = texteAvecRetoursChariots.substr(1);
    return texteAvecRetoursChariots;
}
