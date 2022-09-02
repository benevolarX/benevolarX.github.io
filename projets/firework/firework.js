"use strict";

const MAX_PARTICLES = 400;

let sounds = [];
let current = -1;

class Particule {
	constructor(x = 0, y = 0) {
		this.pos = { x, y };
		this.vel = { x: 0, y: 0 };
		this.shrink = 0.97;
		this.size = 2;
		this.resistance = 1;
		this.gravity = 0;
		this.flick = false;
		this.alpha = 1;
		this.fade = 0;
		this.color = 0;
	}

	update() {
		this.vel.x *= this.resistance;
		this.vel.y *= this.resistance;
		this.vel.y += this.gravity;
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
		this.size *= this.shrink;
		this.alpha -= this.fade;
	}

	render(c) {
		if (!this.exists) {
			return;
		}
		c.save();
		c.globalCompositeOperation = 'lighter';
		let x = this.pos.x
		let y = this.pos.y
		let r = this.size / 2;
		let gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
		gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
		gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
		gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");
		c.fillStyle = gradient;
		c.beginPath();
		c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
		c.closePath();
		c.fill();
		c.restore();
	}

	get exists() { 
		return this.alpha >= 0.1 && this.size >= 1; 
	}
}

class Rocket extends Particule {

	constructor(x, screen_height) {
		super(x, screen_height);
		this.explosionColor = 0;
	}

	explode(firework) {
		if (firework.options.sound && firework.options.sound.length > 0) {
			let randomNumber = ((min, max) => {
				return Math.floor(Math.random() * (max - min + 1) + min)
			})(0, firework.options.sound.length - 1);
			if (current == randomNumber) {
				sounds[randomNumber].currentTime = 0
			} else {
				if (current >= 0) {
					sounds[current].stop()
				}
				if (randomNumber < sounds.length && sounds[randomNumber].readyState >= 2) {
					sounds[randomNumber].addEventListener("canplaythrough", () => {
						sounds[randomNumber].play();
					});
				}
			}
			current = randomNumber
		}
		const count = Math.random() * 10 + 80;
		for (let i = 0; i < count; i++) {
			let particle = new Particule(this.pos.x, this.pos.y);
			let angle = Math.random() * Math.PI * 2;
			let speed = Math.cos(Math.random() * Math.PI / 2) * 15;
			particle.vel.x = Math.cos(angle) * speed;
			particle.vel.y = Math.sin(angle) * speed;
			particle.size = 10;
			particle.gravity = 0.2;
			particle.resistance = 0.92;
			particle.shrink = Math.random() * 0.05 + 0.93;
			particle.flick = true;
			particle.color = this.explosionColor;
			firework.particules.push(particle);
		}
	}

	render(c) {
		if (!this.exists) {
			return;
		}
		c.save();
		c.globalCompositeOperation = 'lighter';
		const x = this.pos.x;
		const y = this.pos.y
		const r = this.size / 2;
		const gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
		gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
		gradient.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");
		c.fillStyle = gradient;
		c.beginPath();
		c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
		c.closePath();
		c.fill();
		c.restore();
	};
}


class Firework {

	constructor(options = {}) {
		this.options = options;
		this.options.sound = options.sound ?? false;
		this.options.opacity = options.opacity ?? 1;
		this.options.speed = options.speed ?? 100;
		this.options.max_rocket = options.max_rocket ?? 10;
		this.options.max_luminosite = options.max_luminosite ?? 10;
		this.particules = [];
		this.rockets = [];
		this.max_particules = MAX_PARTICLES;
		this.screen_width = this.options.width;
		this.screen_height = this.options.height;
		this.const_opacity = this.options.opacity;
		this.canvas = document.createElement('canvas');
		this.canvas.id = 'fireworksField';
		this.canvas.width = this.screen_width;
		this.canvas.height = this.screen_height;
		this.canvas.style.width = this.screen_width + 'px';
		this.canvas.style.height = this.screen_height + 'px';
		this.canvas.style.position = 'absolute';
		this.canvas.style.opacity = this.options.opacity;
		this.canvas.classList.add(this.options.classNames ?? '');
		this.context = this.canvas.getContext('2d');
		this.pc_flash = 100.0;
		this.cpt_launch = 0;
		this.cpt_loop = 0;
		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);
		this.play = this.play.bind(this);
		this.loop = this.loop.bind(this);
		this.launchFrom = this.launchFrom.bind(this);
		if (options.sound && options.sound.length > 0) {
			options.sound.forEach(url => {
				let audio = document.createElement('audio')
				audio.autoplay = false
				audio.src = url
				sounds.push(audio)
			})
		}
		
	}

	attach(elem) {
		this.elem = elem;
		this.options.width = this.options.width ?? elem.width ?? 100;
		this.options.height = this.options.height ?? elem.height ?? 100;
		this.elem.appendChild(this.canvas);
	}

	start() {
		this.id_anim = window.requestAnimationFrame(this.play);
	}

	stop() {
		window.cancelAnimationFrame(this.id_anim);
	}

	play() {
		this.cpt_launch += (16.6666);
		this.cpt_loop += (16.6666);
		const vitesse = 100 / this.options.speed;
		const max_launch = vitesse * 800;
		if (parseInt(this.cpt_launch) > max_launch) {
			this.launchFrom();
			this.cpt_launch -= max_launch;
		}
		const max_loop = vitesse * 20;
		if (parseInt(this.cpt_loop) > max_loop) {
			this.loop();
			this.cpt_loop -= max_loop;
		}
		this.id_anim = window.requestAnimationFrame(this.play);
	}
	
	loop() {
		if (this.screen_width != window.innerWidth) {
			this.canvas.width = this.screen_width = window.innerWidth;
		}
		if (this.screen_height != window.innerHeight) {
			this.canvas.height = this.screen_height = window.innerHeight;
		}
		const pc = Math.round((100 - this.pc_flash) * 255 * this.options.max_luminosite / 100);
		this.context.fillStyle = `rgba(${pc},${pc},${pc},0.05)`;
		this.context.fillRect(0, 0, this.screen_width, this.screen_height);
		let existingRockets = [];
		for (let i = 0; i < this.rockets.length; i++) {
			this.rockets[i].update();
			this.rockets[i].render(this.context);
			let distance = Math.sqrt(Math.pow(this.screen_width - this.rockets[i].pos.x, 2) + Math.pow(this.screen_height - this.rockets[i].pos.y, 2));
			let randomChance = this.rockets[i].pos.y < (this.screen_height * 2 / 3) ? (Math.random() * 100 <= 1) : false;
			if (this.rockets[i].pos.y < this.screen_height / 5 || this.rockets[i].vel.y >= 0 || distance < 50 || randomChance) {
				this.rockets[i].explode(this);
				this.pc_flash *= 0.9;
				this.pc_flash = Math.max(this.pc_flash, (100 - this.options.max_luminosite));
			} else {
				existingRockets.push(this.rockets[i]);
			}
		}
		this.rockets = existingRockets;
		let existingParticles = [];
		for (let i = 0; i < this.particules.length; i++) {
			this.particules[i].update();
			if (this.particules[i].exists) {
				this.particules[i].render(this.context);
				existingParticles.push(this.particules[i]);
			}
		}
		this.particules = existingParticles;
		while (this.particules.length > this.max_particules) {
			this.particules.shift();
		}
		if (this.pc_flash < 100) {
			this.pc_flash *= 1.05;
			this.pc_flash = Math.min(this.pc_flash, 100);
		}
	}

	launchFrom(dw = null) {
		let x = dw ?? this.screen_width / 2;
		if (this.rockets.length < this.options.max_rocket) {
			let rocket = new Rocket(x, this.screen_height);
			rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
			rocket.vel.y = Math.random() * -3 - 4;
			rocket.vel.x = Math.random() * 6 - 3;
			rocket.size = 8;
			rocket.shrink = 0.999;
			rocket.gravity = 0.01;
			this.rockets.push(rocket);
		}
	}

};
