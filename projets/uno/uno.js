"use strict";

const WIDTH = 1200;
const HEIGHT = 800;

const PIOCHE = -1;
const DEFAUSSE = -2;
const VISIBLE = -3;

const PLUS_2 = 10;
const PASSE_TOUR = 11;
const CHANGE_SENS = 12;

const PLUS_4 = 13;
const CHANGE_COULEUR = 14;

const DOS = 15;
const JOKER = 4;

const COULEUR = ["rouge", "bleu", "vert", "jaune", "joker", "dos"];
const VALEUR = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "plus_2", "passe_tour", "change_sens", "plus_4", "change_couleur", "dos"];

function shuffle(a) 
{
    for (let i = a.length - 1; i > 0; i--) 
	{
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

class Carte 
{
	
	constructor(couleur, valeur, qui) 
	{
		this.couleur = couleur;
		this.valeur = valeur;
		this.qui = qui;
	}
	
	get isNumber() 
	{
		return 0 <= this.valeur && this.valeur <= 9;
	}
	
	get isJoker() 
	{
		return this.couleur === JOKER || this.valeur === PLUS_4 || this.valeur === CHANGE_COULEUR;
	}
	
	canPlayOn(carte) 
	{
		return this.couleur === carte.couleur || this.valeur === carte.valeur || this.isJoker();
	}
	
	get Url() {
		return `../assets/cartes/${VALEUR[this.valeur]}_${COULEUR[this.couleur]}.png`;
	}
	
	toString() 
	{
		return `${VALEUR[this.valeur]} ${COULEUR[this.couleur]} ${this.qui} \n`;
	}
	
}

class UnoGame 
{
	
	constructor() 
	{
		this.init();
	}

	init() 
	{
		this.nb_joueur = 2;
		this.tour = 0;
		this.pas = 1;
		this.cartes = [];
		// pioche
		for (let couleur = 0; couleur < 4; couleur++) 
		{
			for (let valeur = 1; valeur < 13; valeur++) 
			{
				this.cartes.push(new Carte(couleur, valeur, PIOCHE));
				this.cartes.push(new Carte(couleur, valeur, PIOCHE));
			}
			this.cartes.push(new Carte(couleur, 0, PIOCHE));
			this.cartes.push(new Carte(JOKER, PLUS_4, PIOCHE));
			this.cartes.push(new Carte(JOKER, CHANGE_COULEUR, PIOCHE));
		}

		// carte visible
		let c = this.piocher(VISIBLE);
		while (c != null && !c.isNumber) 
		{
			c.qui = DEFAUSSE;
			c = this.piocher(VISIBLE);
		}

		// cartes des joueurs
		for (let j = 0; j < 7; j++) {
			for (let i = 0; i < this.nb_joueur; i++) {
				this.piocher(i);
			}
		}
	}
	
	piocher(qui, ou = PIOCHE) 
	{
		shuffle(this.cartes);
		let c = this.cartes.find(c => c.qui === ou);
		if (c === null) 
		{
			return null;
		}
		c.qui = qui;
		return c;
	}
	
	update(canvas) 
	{
		let w = canvas.width;
		let h = canvas.height;
		let ctx = canvas.getContext("2d");
		ctx.fillStyle = "#000";
		ctx.clearRect(0, 0, w, h);
		ctx.fillRect(0, 0, w, h);
		
		let ratio = 1.2;
		let wc = 100 * ratio;
		let hc = 130 * ratio;
		let carte_visible = Object.assign(new Carte(0, 0, 0), this.cartes.find(c => c.qui = VISIBLE));
		if (carte_visible !== null) {
			let img = new Image();
			img.src = carte_visible.Url;
			ctx.drawImage(img, w/2 - wc/2, h/2 - hc/2, wc, hc);
		}
		else {
			ctx.fillStyle = "#900";
			ctx.fillRect(w/2 - wc/2, h/2 - hc/2, wc, hc);
		}

		let moi = this.cartes.filter(c => c.qui === 0);
		let decalage = (w - wc * moi.length)/(moi.length - 1);
		for (let i = 0; i < moi.length; i++) {
			let c = Object.assign(new Carte(0, 0, 0), moi[i]);
			let img = new Image();
			img.src = c.Url;
			ctx.drawImage(img, i * (wc + decalage), h - hc, wc, hc);
		}
	}
}

class Game {

	constructor(w, h)
	{
		const self = this;
		const div = document.getElementById('game');
		this.game = new UnoGame();
		if (window.sessionStorage.getItem("save") !== null) {
			this.restaure();
		}
		this.canvas = document.createElement('canvas');
		this.canvas.width = w;
		this.canvas.height = h;
		div.appendChild(this.canvas);
		div.appendChild(document.createElement('hr'));
		let save = document.createElement('button');
		save.innerHTML = "save";
		save.onclick = () => { self.save(); };
		div.appendChild(save);
		let reset = document.createElement('button');
		reset.onclick = () => { self.restaure(); };
		reset.innerHTML = "reset";
		div.appendChild(reset);
		let clean = document.createElement('button');
		clean.innerHTML = "clean";
		clean.onclick = () => { self.clean(); };
		div.appendChild(clean);
	}
	
	restaure() {
		let g = JSON.parse(window.sessionStorage.getItem('save'));
		this.game = Object.assign(this.game, g);
		console.log(g);
		console.log(this.game);
		return;
	}
	
	save() 
	{
		window.sessionStorage.setItem("save", JSON.stringify(this.game));
		console.log(window.sessionStorage);
	}

	clean() {
		window.sessionStorage.clear();
		console.log(window.sessionStorage);
	}
	
	start()
	{
		this.update();
	}
	
	update() 
	{
		const self = this;
		this.game.update(this.canvas);
		window.requestAnimationFrame(() => self.update());
	}
}
window.onload = () => 
{
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	let game = new Game(WIDTH, HEIGHT);
	game.start();
};
