"use strict";

import GrilleChasse from "./grille-chasse";
import TileChasse from "./tile-chasse";

export default class JeuChasse
{
    static 

    constructor()
    {
        let save = window.sessionStorage.getItem(JeuChasse.name);
        if (save !== null)
        {
            
        }
        const generator = (x, y) => new TileChasse(x, y);
        this.grille_chasse = new GrilleChasse(w, h, generator);
    }

};
