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

const ASSET_DOS = "../assets/uno/dos.png";

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
		return `../assets/uno/${VALEUR[this.valeur]}_${COULEUR[this.couleur]}.png`;
	}
	
	toString() 
	{
		return `${VALEUR[this.valeur]} ${COULEUR[this.couleur]} ${this.qui} \n`;
	}
	
	sort(c) {
		if (c.couleur === this.couleur) {
			if (c.valeur === this.valeur) {
				return 0;
			}
			return this.valeur < c.valeur ? 1 : -1;
		}
		return this.couleur < c.couleur ? 1 : -1;
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
		this.mouse_x = 0;
		this.mouse_y = 0;
		this.a_clic = false;
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
		this.carte_visible = Object.assign(new Carte(0, 0, 0), c);

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
		let c = this.cartes.find(c => c.qui === ou) || null;
		if (c !== null) 
		{
			c.qui = qui;
			return c;
		}
		return null;
	}
	
	clic(e) {
		console.log(e);
		this.mouse_x = e.clientX || 0;
		this.mouse_y = e.clientY || 0;
		this.a_clic = true;
	}
	
	test_clic(x, y, w, h) {
		return this.mouse_x >= x && this.mouse_x <= x + w && this.mouse_y >= y && this.mouse_y <= y + h;
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
		let centre_x = w/2 - wc/2;
		let centre_y = h/2 - hc/2;
		let img = new Image();
		
		// carte visible
		if (this.carte_visible !== null) {
			img = new Image();
			img.src = this.carte_visible.Url;
			ctx.drawImage(img, centre_x - wc, centre_y, wc, hc);
			// pioche 
			img = new Image();
			img.src = ASSET_DOS;
			ctx.drawImage(img, centre_x + wc, centre_y, wc, hc);
			if (this.a_clic && this.test_clic(centre_x + wc, centre_y, wc, hc)) {
				console.log("pioche !");
				console.log(this.piocher(0).toString());
				this.a_clic = false;
			}
		}
		else {
			ctx.fillStyle = "#900";
			ctx.fillRect(centre_x - wc, centre_y, wc, hc);
		}

		// mes cartes
		let moi = this.cartes.filter(c => c.qui === 0).sort((a, b) => a.sort(b));
		let decalage = (w - wc * moi.length)/(moi.length - 1);
		for (let i = 0; i < moi.length; i++) {
			let c = Object.assign(new Carte(0, 0, 0), moi[i]);
			img = new Image();
			img.src = c.Url;
			ctx.drawImage(img, i * (wc + decalage), h - hc, wc, hc);
		}
		
		// cartes adversaire
		let num_adv = this.tour % this.nb_joueur;
		let adv = this.cartes.filter(c => c.qui === 1);
		decalage = (w - wc * adv.length)/(adv.length - 1);
		for (let i = 0; i < adv.length; i++) {
			let img = new Image();
			img.src = ASSET_DOS;
			ctx.drawImage(img, i * (wc + decalage), 0, wc, hc);
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
		const self = this;
		this.canvas.onclick = e => self.game.clic(e);
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
