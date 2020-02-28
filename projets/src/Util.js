function clearChild(elem) 
{
	while (elem.firstElementChild) {
		elem.removeChild(elem.firstElementChild);
	}
}

function dst(x, y, dx, dy)
{
	return Math.sqrt( ((dx - x) ** 2) + ((dy - y) ** 2) );
}

class Html {
	get br() {
		return document.createElement('br');
	}
}

export default { clearChild };
