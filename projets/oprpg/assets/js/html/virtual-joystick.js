"use strict";

const SIZE_BLOC = 150;
const SIZE_STICK = 90;
const MAX_MOVE = 30;
const COLOR_STICK = '#0000A2';
const COLOR_STICK_HOVER = '#B2B2FF';

class VirtualJoystick extends HTMLElement
{
	constructor()
	{
		super();
		this.size_block = (this.hasAttribute("size-block"))
		? parseInt(this.getAttribute("size-block")) : SIZE_BLOC;
		
		this.size_stick = (this.hasAttribute("size-stick"))
		? parseInt(this.getAttribute("size-stick")) : SIZE_STICK;

		this.color_stick = (this.hasAttribute("color-stick"))
		? this.getAttribute("color-stick") : COLOR_STICK;
		
		this.color_stick_hover = (this.hasAttribute("color-stick-hover"))
		? this.getAttribute("color-stick-hover") : COLOR_STICK_HOVER;
		
		this.survol = false;
		this.canvas = null;
		this.pressed = false;
		this.old_clic_x = this.clic_x = 0;
		this.old_clic_y = this.clic_y = 0;
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
	
	dst(x, y, dx, dy)
	{
		return Math.sqrt( ((dx - x) ** 2) + ((dy - y) ** 2) );
	}

	// virtual 
	on_up(e)
	{
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
			let d = this.dst(cx, cy, this.centerX, this.centerY);
			if (d <= this.size_stick / 2)
			{
				this.old_clic_x = this.clic_x = cx;
				this.old_clic_y = this.clic_y = cy;
				this.pressed = true;
				this.identifier = e.identifier;
			}
		}
	}
	
	on_move(e)
	{
		let cx = e.pageX;
		let cy = e.pageY;
		let dx = cx - this.centerX;
		let dy = cy - this.centerY;
		this.hover = Math.sqrt(dx ** 2 + dy ** 2) < (this.size_stick / 2);
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
			this.on_move(e.changedTouches[0]);
		}
	}

	// mouse
	mouse_down = (e) => this.on_down(e);
	mouse_up = (e) => this.on_up(e);
	mouse_move = (e) => this.on_move(e);
	
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
			ctx.strokeStyle = this.color_stick;
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
			ctx.strokeStyle	= this.is_hover ? this.color_stick_hover : this.color_stick;
			ctx.lineWidth = 6; 
			ctx.arc(cx, cy, r, 0, Math.PI*2, true); 
			ctx.stroke();
		}
		this.need_render = false;
	}
	
	build_canvas()
	{
		let canvas = document.createElement('canvas');
		canvas.width = this.size_block;
		canvas.height = this.size_block;
		canvas.style.position = "absolute";
		canvas.style.zIndex = 255;
		canvas.style.background = "rgba(0, 0, 0, 0.0)";
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
	
	// setter
	set stick_color(val)
	{
		if (val !== this.color_stick)
		{
			this.need_render = true;
			this.color_stick = val;
		}
	}
	
	set color_hover(val)
	{
		if (val !== this.color_stick_hover)
		{
			this.need_render = true;
			this.color_stick_hover = val;
		}
	}
	
	/**
	 * @param {boolean} val
	 */
	set hover(val)
	{
		if (this.survol !== val)
		{
			this.need_render = true;
			this.survol = val;
		}
	}
	
	// getter
	get is_hover()
	{
		return this.pressed || this.survol;
	}
	
	get is_touch_device() 
	{
		return 'ontouchstart' in window;
	}
	
	get centerX()
	{
		return this.canvas.getBoundingClientRect().x + this.canvas.width / 2;
	}
	
	get centerY()
	{
		return this.canvas.getBoundingClientRect().y + this.canvas.height / 2;
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
}

window.customElements.define('virtual-joystick', VirtualJoystick);
