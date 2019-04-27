"use strict";

class Point
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
};

class Rectangle extends Point
{
	constructor(x, y, w, h, color)
	{
		super(x, y);
		this.w = w;
		this.h = h;
		this.color = color;
	}
	
	static buildDialog(bord, ww, hh, color, pourcent_h)
	{
		let h = parseInt(hh * pourcent_h / 100);
		let x = bord;
		let y = hh - bord - h;
		let w = ww - 2 * bord;
		return new Rectangle(x, y, w, h, color);
	}
	
	draw(ctx)
	{
		let old_color = ctx.fillStyle;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.fillStyle = old_color;
	}
};
