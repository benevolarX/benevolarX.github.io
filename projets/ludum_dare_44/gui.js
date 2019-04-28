"use strict";

class Gui 
{
    static buildDialogBox(bord, ww, hh, color, pourcent_h)
	{
		let h = parseInt(hh * pourcent_h / 100);
		let x = bord;
		let y = hh - bord - h;
		let w = ww - 2 * bord;
		return new Rectangle(x, y, w, h, color);
	}
}