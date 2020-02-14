class Trou
{
	constructor() 
	{
		this.gauche = null;
		this.droite = null;
		this.haut_gauche = null;
		this.haut_droite = null;
		this.bas_gauche = null;
		this.bas_droite = null;
		this.bille = null;
	}
	
	setDroite(trou) { this.droite = trou; }
	setGauche(trou) { this.gauche = trou; }
	setHautGauche(trou) { this.haut_gauche = trou; }
	setHautDroite(trou) { this.haut_droite = trou; }
	setBasGauche(trou) { this.bas_gauche = trou; }
	setBasDroite(trou) { this.bas_droite = trou; }
	
	getBille() { return this.bille; }
	setBille(bille) { this.bille = bille; }
	
	isEmpty() { return this.bille === null; }
}

class Plateau 
{
	constructor()
	{
		this.trous = [];
		this.init();
	}
	init() 
	{
		let max = 5;
		let old_max = max;
		let n = 0;
		for (let i = 0; i < 9; i++) 
		{
			for (let k = 0; k < max; k++)
			{
				let trou = new Trou();
				if (i < 2 || (i === 2 && k > 1 && k < 5))
				{
					trou.setBille("noir");
				}
				if (i > 6 || (i === 6 && k > 1 && k < 5))
				{
					trou.setBille("blanc");
				}
				this.trous.push(trou);
				n++;
				if (k > 0) 
				{
					trou.setGauche(this.trous[n - 1]);
					this.trous[n - 1].setDroite(trou);
				}
				if (i > 0)
				{
					if (i < 5) 
					{
						let droite = n - old_max;
						if (k < max)
						{
							trou.setHautDroite(this.trous[droite]);
							this.trous[droite].setBasGauche(trou);
						}
						let gauche = droite - 1;
						if (k > 0) 
						{
							trou.setHautGauche(this.trous[gauche]);
							this.trous[gauche].setBasDroite(trou);
						}
					}
					else 
					{
						let droite = n - max
						trou.setHautDroite(this.trous[droite]);
						this.trous[droite].setBasGauche(trou);
						let gauche = droite - 1;
						trou.setHautGauche(this.trous[gauche]);
						this.trous[gauche].setBasDroite(trou);
					}
				}
				
			}
			old_max = max;
			max += (i < 4) ? 1 : -1;
		}
	}
	over(x, y)
	{
		
	}
}

window.onload = () => 
{
	let main = document.querySelector('#main');
	let canvas = document.createElement('canvas');
	canvas.width = 800;
	canvas.height = 500;
	let ctx = canvas.getContext("2d");
	ctx.strokeRect(0,0,800,500);
	main.appendChild(canvas);
	let game = new Plateau();
	function draw() 
	{
		ctx.clearRect(0, 0, 800, 500);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, 800, 500);
		
		let centreX = 0;
		let centreY = 0;
		let radius = 20;
		let diag = 2 * radius;
		let deca = 5;
		let startAngle = 0 * Math.PI/180;
		let endAngle = 360 * Math.PI/180;
		let max = 5;
		let n = 0;
		for (let i = 0; i < 9; i++)
		{
			for (let j = 0; j < max; j++)
			{
				centreX = 400 - (j * (diag + deca)) + (max * (diag + deca) / 2);
				centreY = 80 + i * (radius * 2);
				ctx.beginPath();
				if (game.trous[n].isEmpty())
				{
					ctx.strokeStyle = "black";
					ctx.fillStyle = "white";
				}
				else 
				{
					let color = (game.trous[n].getBille() === "blanc") ? "red" : "blue";
					ctx.strokeStyle = "black";
					ctx.fillStyle = color;
				}
				ctx.arc(centreX,centreY,radius,startAngle,endAngle,false);
				ctx.fill();
				ctx.stroke();
				n++;
			}
			max += (i < 4) ? 1 : -1;
		}
		window.requestAnimationFrame(draw);
	}
	window.requestAnimationFrame(draw);
}