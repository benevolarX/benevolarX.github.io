
function get_morceau_image(x, y, img) {
	let w = img.width;
	let h = img.height;
	let demi_w = w / 2;
	let demi_h = h / 2;
	let x_dep = (x > demi_w) ? demi_w : 0;
	let y_dep = (y > demi_h) ? demi_h : 0;
	let rep = [];
	for (let i = x_dep; i < x_dep + demi_w; i++) {
		let ligne = [];
		for (let j = y_dep; j < y_dep + demi_h; j++) {
			ligne.push(img[i][j]);
		}
		rep.push(ligne);
	}
	return rep;
}

function get_couleur_fond(img) {
	let r = 0;
	let g = 0;
	let b = 0;
	for (let i = 0; i < img.width; i++) {
		for (let j = 0; j < img.height; j++) {
			let c = img[i][j];
			r += c.r;
			g += c.g;
			b += c.b;
		}
	}
	let pixels = (img.width * img.height);
	r /= pixels;
	g /= pixels;
	b /= pixels;
	return { r, g, b };
}