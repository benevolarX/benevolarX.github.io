"use strict";

const WIDTH = 1200;
const HEIGHT = 800;

const ASSET = "../assets/ludum/";
const GIT = "https://benevolarx.github.io/projets/ludum_dare_44/";
const FR = "fr";
const LANG_URL = `${GIT}/lang/${FR}.json`;

async function get_dialog() {
	let res = await fetch(LANG_URL, { method: 'GET' } );
	return res.json();
}
let texte_hospital = "hello";
Promise.resolve(get_dialog()
.then(d => { 
	console.log(d.dialog);
	texte_hospital = d.dialog.long;
	return d.dialog;
}));

function drawMultipleLine(ctx, txt, x, y, color, font, font_size, max_w, max_x = 800)
{
	let nb_char = txt.length;
	ctx.save();
	ctx.font = font_size + "px " + font;
	ctx.fillStyle = color;
	ctx.translate(x, y);
	let char_size = font_size / 2;
	if (max_w < nb_char * char_size)
	{
		let mots = txt.split(' ');
		let cpt = 0;
		let lines = [];
		let line = "";
		let i = 0;
		for (i = 0; i < mots.length - 1; i++)
		{
			cpt += mots[i].length * char_size;
			if (cpt > max_w) 
			{
				lines.push(line);
				line = `${mots[i]} `;
				cpt = 0;
			}
			else {
				line += `${mots[i]} `;
			}
		}
		lines.push(mots[i]);
		for (i = 0; i < lines.length - 1; i++)
		{
			if (i * font_size > max_x) {
				ctx.restore();
				return { lines, i };
			}
			ctx.fillText(lines[i], 0, i * font_size, max_w);
		}
	}
	else {
		ctx.fillText(txt, 0, 0, max_w);
	}
	ctx.restore();
}

class Dialogue
{
	constructor(texte)
	{
		this.texte = texte;
		this.font_style = "Arial";
		this.font_size = 32;
		this.font_color = "white";
		this.bord = 10;
	}
	
	get font()
	{
		return `${this.font_size}px ${this.font_style}`;
	}
	
	draw(ctx, rect)
	{
		rect.draw(ctx);
		let max_w = (rect.w - 2 * this.bord);
		let max_h = 200; // rect.h - 2 * this.bord
		drawMultipleLine(ctx, this.texte, rect.x + this.bord, rect.y + this.bord + this.font_size, "red", this.font_style, this.font_size, max_w, max_h);
	}
}

const HOSPITAL = "hospital";

class LudumDareGame 
{
	constructor() 
	{
		this.imgs = new Map();
		this.init();
	}
	
	init()
	{
		let hospital = new Image();
		hospital.src = `${ASSET}/fond/hospital.png`;
		this.imgs.set(HOSPITAL, hospital);

		this.rect = Rectangle.buildDialog(40, WIDTH, HEIGHT, "rgb(20, 75, 16)", 20);
		this.dialogue = new Dialogue(texte_hospital);
	}
	
	update(canvas)
	{
		// console.log(canvas);
		let ctx = canvas.getContext('2d');
		ctx.fillStyle = "rgb(20, 100, 100)";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		ctx.drawImage(this.imgs.get(HOSPITAL), 0, 0);
		this.dialogue.texte = texte_hospital;
		this.dialogue.draw(ctx, this.rect);
	}

	clic(e)
	{
		console.log("clic");
		return;
	}
}

class Game 
{

	constructor(w, h)
	{
		const self = this;
		const div = document.getElementById('game');
		this.game = new LudumDareGame();
		this.canvas = document.createElement('canvas');
		this.canvas.width = w;
		this.canvas.height = h;
		div.appendChild(this.canvas);
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
