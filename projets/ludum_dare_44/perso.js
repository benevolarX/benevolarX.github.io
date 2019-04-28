"use strict";

class Perso
{

    constructor()
    {
        this.inventaire = [];
        this.organes = [];
    }

    reset()
    {
        this.inventaire = [];
        this.organes = [];
        this.organes.push("bras_droit");
		this.organes.push("bras_gauche");
		this.organes.push("oeil_droit");
		this.organes.push("oeil_gauche");
		this.organes.push("jambe_droit");
		this.organes.push("jambe_gauche");
		for (let i = 0; i < 5; i++) 
		{
			this.organes.push("doigt_droit");
			this.organes.push("doigt_gauche");
		}
    }


}