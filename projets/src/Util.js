function clearChild(elem) 
{
	while (elem.firstElementChild) {
		elem.removeChild(elem.firstElementChild);
	}
}

class Html {
	get br() {
		return document.createElement('br');
	}
}

export default {clearChild };
