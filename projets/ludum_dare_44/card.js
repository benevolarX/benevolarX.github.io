"use strict";

const PIQUE = 3;
const COEUR = 2;
const CARREAU = 1;
const TREFLE = 0;

const VALET = 11;
const DAME = 12;
const ROI = 13;
const AS = 14;
const VALEUR = [2, 3, 4, 5, 6, 7, 8, 9, 10, VALET, DAME, ROI, AS];

const RIEN = 0;
const PAIRE = 1;
const DOUBLE_PAIRE = 2;
const BRELAN = 3;
const SUITE = 4;
const COULEUR = 5;
const FULL = 6;
const CARRE = 7;
const QUITE_FLUSH = 8;
const ROYAL = 9;

class Card
{
    constructor(valeur, couleur)
    {
        this.valeur = valeur;
        this.couleur = couleur;
    }
}

class Poker
{
    static check_best(main = [], table = [])
    {
        let cartes = main.concat(table);
        let best = RIEN;
        let nb_couleur = [];
        for (let i = 0; i < 4; i++) {
            nb_couleur.push(cartes.filter(c => c.couleur === i).length)
        }
        if (Math.max(...nb_couleur) >= 5) {
            best = COULEUR;
        }
        return best;
    }

}