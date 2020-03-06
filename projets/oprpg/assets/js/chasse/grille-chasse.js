"use strict";


export default class GrilleChasse
{

    constructor(w, h, generator)
    {
        
        this.w = w;
        this.h = h;
        this.generator = generator;
    }

    genererGrille()
    {
        this.grille = [];
        for (let i = 0; i < this.w; i++)
        {
            let ligne = [];
            for (let j = 0; j < this.h; j++)
            {
                this.ligne.push(this.generator(i, j));
            }
            this.grille.push(ligne);
        }
    }



};
