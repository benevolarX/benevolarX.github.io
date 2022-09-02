"use strict";

class Compte
{
    constructor()
    {
        this.id = -1;
        this.pseudo = null;
        this.email = null;
        this.berry = 0;
    }

};

class CompteInvite extends Compte
{
    connecter(pseudo, mdp)
    {
        return $this;
    }
}

class CompteConnecte extends Compte 
{
    constructor(compte)
    {
        this.id = compte.id;
        this.pseudo = compte.pseudo;
        this.email = compte.email;
        this.berry = compte.berry;
    }

    deconnecter()
    {
        return new CompteInvite();
    }
}

export default { Compte, CompteInvite, CompteConnecte };