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
    
    static drawMultipleLine(ctx, txt, x, y, color, font, font_size, max_w, max_x = 800)
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
            for (i = 0; i < mots.length; i++)
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
            lines.push(line);
            for (i = 0; i < lines.length; i++)
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

}

class Dialogue
{
	constructor(texte, color = "white", style = "Arial", size = 32, bord = 10)
	{
		this.texte = texte;
		this.font_style = style;
		this.font_size = size;
		this.font_color = color;
		this.bord = bord;
	}
	
	get font()
	{
		return `${this.font_size}px ${this.font_style}`;
	}
	
	draw(ctx, rect)
	{
		rect.draw(ctx);
		let max_w = (rect.w - 2 * this.bord);
		let max_h = (rect.h - 2 * this.bord);
		Gui.drawMultipleLine(ctx, this.texte, rect.x + this.bord, rect.y + this.bord + this.font_size, this.font_color, this.font_style, this.font_size, max_w, max_h);
	}
}
