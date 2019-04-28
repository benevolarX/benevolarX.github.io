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
        ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.restore();
	}
};

class Cercle extends Point 
{
    constructor(x, y, r, color)
    {
        super(x, y);
        this.r = r;
        this.color = color;
    }

    draw(ctx)
    {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
}