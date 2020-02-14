"use strict";

const SIZE_BLOC = 150;
const SIZE_STICK = 90;
const MAX_MOVE = 30;
const COLOR_STICK = '#0000A2';
const COLOR_STICK_HOVER = '#B2B2FF';

class GUIElement extends HTMLElement
{
	constructor()
	{
		super();
	}
	
	dst(x, y, dx, dy)
	{
		return Math.sqrt( ((dx - x) ** 2) + ((dy - y) ** 2) );
	}
	
	attributeChangedCallback(attrName, oldValue, newValue) 
	{
		if (newValue !== oldValue) 
		{
			this[attrName] = this.hasAttribute(attrName);
		}
	}
}

class VirtualJoystick extends GUIElement 
{
	constructor()
	{
		super();
		this.canvas = null;
		this.pressed = false;
		this.old_clic_x = this.clic_x = 0;
		this.old_clic_y = this.clic_y = 0;
		this.c = COLOR_STICK;
		this.need_render = true;
		
		this.on_move = this.on_move.bind(this);
		this.on_down = this.on_down.bind(this);
		this.on_up = this.on_up.bind(this);
		
		this.mouse_down = this.mouse_down.bind(this);
		this.mouse_up = this.mouse_up.bind(this);
		this.mouse_move = this.mouse_move.bind(this);
		
		this.identifier = null;
		
		if (this.is_touch_device)
		{
			this.touch_start = this.touch_start.bind(this);
			this.touch_end = this.touch_end.bind(this);
			this.touch_move = this.touch_move.bind(this);
		}
		
	}

	// virtual 
	on_up(e)
	{
		e.preventDefault();
		this.old_clic_x = this.clic_x = 0;
		this.old_clic_y = this.clic_y = 0;
		this.pressed = false;
		this.need_render = true;
		this.render_canvas();
	}
	
	on_down(e)
	{
		if (!this.pressed)
		{
			let cx = e.pageX;
			let cy = e.pageY;
			console.log(e);
			console.log(`clientx : ${cx} vs pagex : ${e.pageX}`)
			let d = this.dst(cx, cy, this.centerX, this.centerY);
			if (d <= SIZE_STICK / 2)
			{
				this.old_clic_x = this.clic_x = cx;
				this.old_clic_y = this.clic_y = cy;
				this.pressed = true;
				this.identifier = e.identifier;
			}
		}
	}
	
	on_move(cx, cy)
	{
		let dx = cx - this.centerX;
		let dy = cy - this.centerY;
		const hover = Math.sqrt(dx ** 2 + dy ** 2) < (SIZE_STICK / 2);
		this.color = hover ? COLOR_STICK_HOVER : COLOR_STICK;
		if (this.pressed)
		{
			this.clic_x = cx;
			this.clic_y = cy;
			this.need_render = true;
		}
		this.render_canvas();
	}

	// pad

	touch_start(e) 
	{
		this.on_down(e.changedTouches[0]);
	}
	touch_end(e) 
	{
		if (this.identifier === e.changedTouches[0].identifier)
		{
			this.on_up(e.changedTouches[0]);
		}
	}
	touch_move(e) 
	{
		if (this.identifier === e.changedTouches[0].identifier)
		{
			this.on_move(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
		}
	}

	// mouse

	mouse_down = (e) => this.on_down(e);
	mouse_up = (e) => this.on_up(e);
	mouse_move(e)
	{
		e.preventDefault();
		this.on_move(e.pageX, e.pageY);
	}
	
	render_canvas()
	{
		if (this.need_render)
		{
			let ctx = this.canvas.getContext('2d');
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			let cx = this.canvas.width / 2;
			let cy = this.canvas.height / 2;
			let r = Math.min(cx, cy) * 0.9;
			ctx.beginPath(); 
			ctx.strokeStyle = COLOR_STICK;
			ctx.lineWidth = 2;
			ctx.arc(cx, cy, r, 0, Math.PI*2, true); 
			ctx.stroke();
			
			r *= 0.6;
			let dd = Math.sqrt(this.deltaX ** 2 + this.deltaY ** 2);
			let ax = this.deltaX;
			let ay = this.deltaY;
			if (dd > MAX_MOVE)
			{
				ax *= MAX_MOVE / dd;
				ay *= MAX_MOVE / dd;
			}
			cx += ax;
			cy += ay;
			ctx.beginPath(); 
			ctx.strokeStyle	= this.c;
			ctx.lineWidth = 6; 
			ctx.arc(cx, cy, r, 0, Math.PI*2, true); 
			ctx.stroke();
		}
		this.need_render = false;
	}
	
	build_canvas()
	{
		let canvas = document.createElement('canvas');
		canvas.width = SIZE_BLOC;
		canvas.height = SIZE_BLOC;
		canvas.style.position = "absolute";
		canvas.style.zIndex = 255;
		canvas.style.background = "rgba(0, 0, 0, 0.02)";
		return canvas;
	}
	
	// html element

	connectedCallback() 
	{
		this.attachEvents();
	}
	
	attachEvents()
	{
		if (this.canvas === null)
		{
			this.canvas = this.build_canvas();
		}
		// this.canvas.style.setProperty('background', 'red');
		this.canvas.addEventListener('mousedown', this.mouse_down);
		document.addEventListener('mouseup', this.mouse_up);
		document.addEventListener('mousemove', this.mouse_move);
		if (this.is_touch_device)
		{
			this.canvas.addEventListener('touchstart', this.touch_start);
			document.addEventListener('touchend', this.touch_end);
			document.addEventListener('touchcancel', this.touch_end);
			document.addEventListener('touchmove', this.touch_move);
		}
		this.appendChild(this.canvas);
		this.render_canvas();
	}

	disconnectedCallback()
	{
		if (this.is_touch_device)
		{
			this.canvas.removeEventListener('touchstart', this.touch_start);
			document.removeEventListener('touchend', this.touch_end);
			document.removeEventListener('touchcancel', this.touch_end);
			document.removeEventListener('touchmove', this.touch_move);
		}
		this.canvas.removeEventListener('mousedown', this.mouse_down);
		document.removeEventListener('mouseup', this.mouse_up);
		document.removeEventListener('mousemove', this.mouse_move);
		this.removeChild(this.canvas);
	}
	
	// getter & setter
	
	set color(val)
	{
		if (val !== this.c)
		{
			this.need_render = true;
			this.c = val;
		}
	}
	
	get is_touch_device() 
	{
		return 'ontouchstart' in window;
	}
	
	get posX() 
	{
		return this.canvas.getBoundingClientRect().x;
	}
	
	get posY() 
	{
		return this.canvas.getBoundingClientRect().y;
	}
	
	get deltaX()
	{
		return this.clic_x - this.old_clic_x;
	}
	
	get deltaY()
	{
		return this.clic_y - this.old_clic_y;
	}
	
	get is_up() 
	{
		if (this.pressed === false) return false;
		let dy = this.deltaY;
		if (dy >= 0) return false;
		let dx = this.deltaX;
		return !(Math.abs(dx) > 2*Math.abs(dy));
	}
	
	get is_down() 
	{
		if (this.pressed === false) return false;
		let dy = this.deltaY;
		if (dy <= 0) return false;
		let dx = this.deltaX;
		return !(Math.abs(dx) > 2*Math.abs(dy));
	}
	
	get is_left() 
	{
		if (this.pressed === false) return false;
		let dx = this.deltaX;
		if (dx >= 0) return false;
		let dy = this.deltaY;
		return !(Math.abs(dy) > 2*Math.abs(dx));
	}
	
	get is_right() 
	{
		if (this.pressed === false) return false;
		let dx = this.deltaX;
		if (dx <= 0) return false;
		let dy = this.deltaY;
		return !(Math.abs(dy) > 2*Math.abs(dx));
	}
	
	get centerX()
	{
		return this.posX + this.canvas.width / 2;
	}
	
	get centerY()
	{
		return this.posY + this.canvas.height / 2;
	}
}

window.customElements.define('virtual-joystick', VirtualJoystick);

window.onload = () => {
	let jeu = document.getElementById('jeu');
	let stick = document.querySelector('virtual-joystick');
	let cx = jeu.width / 2;
	let cy = jeu.height / 2;
	let draw = () => {
		let ctx = jeu.getContext('2d');
		ctx.clearRect(0, 0, jeu.width, jeu.height);
		
		let xxx = stick.is_right ? 1 : (stick.is_left ? -1 : 0);
		let yyy = stick.is_up ? -1 : (stick.is_down ? 1 : 0);
		cx += (xxx * 3);
		cy += (yyy * 3);
		
		ctx.beginPath(); 
		ctx.fillStyle = "red";
		ctx.lineWidth = 2;
		ctx.arc(cx, cy, 30, 0, Math.PI*2, true); 
		ctx.fill();
		window.requestAnimationFrame(draw);
	}
	window.requestAnimationFrame(draw);
};