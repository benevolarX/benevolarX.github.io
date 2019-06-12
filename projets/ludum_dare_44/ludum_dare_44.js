"use strict";

const WIDTH = 1200;
const HEIGHT = 800;

const ASSET = "./assets/";
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
	console.log(d.dialog.long);
	texte_hospital = d.dialog.long;
	return d.dialog;
}));

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
		hospital.src = `${ASSET}/img/fond/hospital.png`;
		this.imgs.set(HOSPITAL, hospital);

		this.rect = Rectangle.buildDialog(40, WIDTH, HEIGHT, "rgb(20, 75, 16)", 20);
		this.dialogue = new Dialogue(texte_hospital);
	}
	
	update(canvas)
	{
		let ctx = canvas.getContext('2d');
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
		let ctx = this.canvas.getContext('2d');
		ctx.fillStyle = "rgb(20, 100, 100)";
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
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
