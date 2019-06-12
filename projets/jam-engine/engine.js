"use strict";

class AssetManager
{
	constructor() {
		this.urls = new Map();
		this.sounds = new Map();
		this.imgs = new Map();
	}
	
	addSound(src, key) {
		this.urls.set(key, src);
		this.sounds.set(key, new Audio(src));
	}
	
	getSound(key) {
		return this.sounds.get(key);
	}
	
	getNewSound(key) {
		return new Audio(this.urls.get(key));
	}
	
	addImage(src, key) {
		let img = new Image();
		img.src = src;
		this.imgs.set(key, img);
	}
	
	getImage(key) {
		return this.imgs.get(key);
	}
	
	clearImage() {
		this.imgs.clear();
	}
}

class Level 
{
	constructor(game) {
		this.game = game;
		this.events = [];
		this.bg = "rgb(160, 218, 245)";
	}

	addEvent(e) {
		this.events.push(e);
		// console.log(e);
	}
	
	start() {
		return this.game.assets.addSound("./assets/sound/moustique.wav", "moustique");
	}

	get canvas() {
		return this.game.canvas;
	}

	get ctx() {
		return this.canvas.getContext('2d');
	}
	
	update() {
		this.ctx.save();
		this.ctx.fillStyle = this.bg;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.restore();
	}
	
	stop() {

	}
	/*
	clic(x, y) {
		console.log(`clic(${x}, ${y})`);
		let s = this.game.assets.getSound("moustique") || null;
		if (s !== null) {
			if (!s.is_played) {
				s.is_played = true;
				s.currentTime = 0;
				s.play();
			}
			else {
				s.pause();
				s.is_played = false;
			}
			console.log(`${s.currentTime} / ${s.duration}`);
		}
		
	}*/
}

class Sprite 
{
	constructor() {

	}
}

class JeuGrenouilleSSJ3 extends Level 
{
	constructor(game) {
		super(game);
	}

	start() {
		super.start();
		this.game.assets.addImage("./assets/img/grenouille.png", "grenouille");
		this.game.assets.addImage("./assets/img/mouche.png", "mouche");
		this.game.assets.addImage("./assets/img/langue.png", "langue");
		this.game.assets.addImage("./assets/img/ssj3.png", "ssj3");
		this.game.assets.addImage("./assets/img/eclair.png", "eclair");
		this.grenouille = new Grenouille(200, 200, this);
		this.ssj3 = new SSJ3(200, 200, this);
		this.transfo = false;
		this.mouches = [];
		for (let i = 0; i < 5; i++) {
			this.mouches.push(new Mouche(Math.random() * 1200, Math.random() * 800, this));
		}
	}

	get player()
	{
		return (this.transfo === true) ? this.ssj3 : this.grenouille;
	}

	update() {
		super.update();
		const clone = [...this.events];
		this.events = [];
		const time = ((new Date).getTime());
		for (let i = 0; i < clone.length; i++) {
			if (clone[i].type === 'click') {
				this.player.click(clone[i].data.x, clone[i].data.y);
			}
			if (clone[i].type === 'keydown') {
				const touche = clone[i].data.touche;
				let ecoule = (time - clone[i].date);
				if (touche === 'KeyD') {
					this.player.move('droite', ecoule);
				}
				if (touche === 'KeyA') {
					this.player.move('gauche', ecoule);
				}
				if (touche === 'KeyW') {
					this.player.move('haut', ecoule);
				}
				if (touche === 'KeyS') {
					this.player.move('bas', ecoule);
				}
				if (touche === 'Space') {
					let xx = this.transfo ? this.ssj3.x : this.grenouille.x;
					let yy = this.transfo ? this.ssj3.y : this.grenouille.y;
					this.transfo = !this.transfo;
					this.player.x = xx;
					this.player.y = yy;
				}
			}
		}
		for (let i = 0; i < this.mouches.length; i++) {
			this.mouches[i].update(time);
		}
		this.player.update(time);
		
		for (let i = 0; i < this.mouches.length; i++) {
			this.mouches[i].draw(this.ctx);
		}
		this.player.draw(this.ctx);
		
		
	}
}

class Entity 
{
	constructor(x, y, level = null) {
		this.level = level;
		this.x = x;
		this.y = y;
		this.time = 0;
	}

	update(time) {

	}

	draw(ctx) {

	}
}

class Langue extends Entity
{
	constructor(x, y, level, dx, dy) {
		super(x, y, level);
		this.dest_x = dx;
		this.dest_y = dy;
		this.speed = 40;
		this.can_retract = false;
		this.can_re_shoot = false;
	}

	update(time) {
		if (this.time !== 0) {
			const t = time - this.time;
			if (this.can_retract) {
				this.dest_x = this.level.grenouille.x + 50 || 0;
				this.dest_y = this.level.grenouille.y + 50 || 0;
			}
			const same_x = (this.x + 5 > this.dest_x && this.x - 5 < this.dest_x);
			const same_y = (this.y + 5 > this.dest_y && this.y - 5 < this.dest_y);
			const st = t * this.speed;
			if (!same_x) {
				const dir_x = this.dest_x - this.x;
				this.x += st * (dir_x / 10000);
			}
			else {
				this.x = this.dest_x;
			}
			if (!same_y) {
				const dir_y = this.dest_y - this.y;
				this.y += st * (dir_y / 10000);
			}
			else {
				this.y = this.dest_y;
			}
			if (same_x && same_y) {
				if (!this.can_retract) {
					this.can_retract = true;
				}
				else {
					if (!this.can_re_shoot) {
						this.can_re_shoot = true;
					}
				}
			}
			
		}
		this.time = time;
	}

	draw(ctx) {
		ctx.save();
		const langue = this.level.game.assets.getImage("langue") || null;
		if (langue !== null) {
			ctx.drawImage(langue, this.x, this.y, 30, 30);
		}
		ctx.restore();
	}
}

class Mouche extends Entity 
{
	constructor(x, y, level) {
		super(x, y, level);
		this.speed = 10;
		this.dest_x = 100;
		this.dest_y = 100;
		this.new_target();
	}

	new_target() {
		this.dest_x = Math.random() * 1200;
		this.dest_y = Math.random() * 800;
	}

	update(time) {
		if (this.time !== 0) {
			const t = time - this.time;
			const same_x = (this.x + 2 > this.dest_x && this.x - 2 < this.dest_x);
			const same_y = (this.y + 2 > this.dest_y && this.y - 2 < this.dest_y);
			const st = t * this.speed;
			if (!same_x) {
				const dir_x = this.dest_x - this.x;
				this.x += st * (dir_x / 10000);
			}
			else {
				this.x = this.dest_x;
			}
			if (!same_y) {
				const dir_y = this.dest_y - this.y;
				this.y += st * (dir_y / 10000);
			}
			else {
				this.y = this.dest_y;
			}
			if (same_x && same_y) {
				this.new_target();
			}
		}
		this.time = time;
	}

	draw(ctx) {
		ctx.save();
		const mouche = this.level.game.assets.getImage("mouche") || null;
		if (mouche !== null) {
			ctx.drawImage(mouche, this.x, this.y, 40, 40);
		}
		ctx.restore();
	}
}

class Player extends Entity 
{
	constructor(x, y, level) {
		super(x, y, level);
		this.num_w = 0;
		this.num_h = 0;
		this.div_w = 8;
		this.div_h = 8;
		this.vitesse = 500;
	}

	is_ssj3() {
		return false;
	}

	click(x, y) {

	}

	move(dir, time) {
		const st = time * this.vitesse / 1000;
		switch(dir) {
			case 'droite': 
				this.x += st;
			break;

			case 'gauche':
				this.x -= st;
			break;

			case 'bas': 
				this.y += st;
			break;

			case 'haut': 
				this.y -= st;
			break;

			default: 
			break;
		}
	}
}

class Grenouille extends Player
{
	constructor(x, y, level) {
		super(x, y, level);
		this.can_shoot = true;
		this.langue = null;
	}

	click(x, y) {
		this.tirer(x, y);
	}

	tirer(a, b) {
		if (this.can_shoot) {
			this.langue = new Langue(this.x + 50, this.y + 50, this.level, a, b);
			this.can_shoot = false;
		}
	}

	update(time) {
		if (this.time !== 0) {
			// const t = time - this.time;
			if (this.langue !== null) {
				this.langue.update(time);
				this.can_shoot = this.langue.can_re_shoot || false;
			}
			if (this.can_shoot) {
				this.langue = null;
			}
		}
		this.time = time;
	}

	draw(ctx) {
		ctx.save();
		const img = this.level.game.assets.getImage("grenouille") || null;
		if (img !== null) {
			let l = img.width / this.div_w;
			let h = img.height / this.div_h;
			let sx = this.num_w * l;
			let sy = this.num_h * h;
			ctx.drawImage(img, sx, sy, l, h, this.x, this.y, 100, 100);
			if (this.langue !== null) {
				this.langue.draw(ctx);
				ctx.beginPath();
				ctx.moveTo(this.x + 50, this.y + 50);
				ctx.strokeStyle = "rgb(237, 28, 36)";
				ctx.lineWidth = 5;
				ctx.lineTo(this.langue.x + 15, this.langue.y + 15);
				ctx.stroke();
			}
		}
		ctx.restore();
	}
}

class SSJ3 extends Player
{
	constructor(x, y, level) {
		super(x, y, level);
		this.div_w = 2;
		this.div_h = 1;
	}

	is_ssj3() {
		return true;
	}

	draw(ctx) {
		ctx.save();
		const img = this.level.game.assets.getImage("ssj3") || null;	
		if (img !== null) {
			let l = img.width / this.div_w;
			let h = img.height / this.div_h;
			let sx = this.num_w * l;
			let sy = this.num_h * h;
			ctx.drawImage(img, sx, sy, l, h, this.x, this.y, 100, 200);
			let eclair = this.level.game.assets.getImage("eclair") || null;
			if (eclair !== null) {
				let xx = this.x + Math.random() * (100 - eclair.width);
				let yy = this.y + Math.random() * (200 - eclair.height);
				ctx.drawImage(eclair, 0, 0, eclair.width, eclair.height, xx, yy, 30, 30);
			}
		}
		ctx.restore();
	}
}

class Game 
{
	constructor(w, h) {
		this.canvas = document.createElement('canvas');
		this.canvas.width = w;
		this.canvas.height = h;
		
		this.levels = [];
		this.currentLevel = -1;
		
		this.assets = new AssetManager();
		
		this.clearColor = "#000";
	}

	addLevel(level, key) {
		this.levels[key] = level;
	}
	
	change_level(num) {
		if (this.currentLevel !== -1 && this.levels.length > 0) {
			this.levels[this.currentLevel].stop();
		}
		this.currentLevel = -1;
		this.levels[num].start();
		this.currentLevel = num;
	}
	
	attach(elem) {
		elem.appendChild(this.canvas);
	}
	
	clic(e) {
		const x = e.clientX - this.canvas.offsetLeft;
		const y = e.clientY - this.canvas.offsetTop;
		if (this.currentLevel !== -1) {
			const self = this;
			this.levels[this.currentLevel].addEvent(self.createEvent('click', { x, y }));
		}
	}

	createEvent(type, data) {
		return { type: type, data: data, date: ((new Date).getTime()) };
	}
	
	start()
	{
		const self = this;
		this.canvas.onclick = e => self.clic(e);
		if (this.currentLevel !== -1) {
			document.addEventListener('keypress', e => self.levels[self.currentLevel].addEvent(self.createEvent('keypress', { touche: e.key })));
			document.addEventListener('keydown', e => self.levels[self.currentLevel].addEvent(self.createEvent('keydown', { touche: e.code })));
			document.addEventListener('keyup', e => self.levels[self.currentLevel].addEvent(self.createEvent('keyup', { touche: e.code })));
			self.levels[self.currentLevel].start();
		}
		this.update();
	}
	
	update() 
	{
		const self = this;
		let ctx = this.canvas.getContext('2d');
		ctx.fillStyle = this.clearColor;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.currentLevel !== -1) {
			this.levels[this.currentLevel].update();
		}
		window.requestAnimationFrame(() => self.update());
	}
	
}

window.onload = () => 
{
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	const WIDTH = 1200;
	const HEIGHT = 800;
	let game = new Game(WIDTH, HEIGHT);
	
	let level = new JeuGrenouilleSSJ3(game);
	game.addLevel(level, 'jeu');
	game.change_level('jeu');
	
	game.attach(document.getElementById('game'));
	game.start();
};