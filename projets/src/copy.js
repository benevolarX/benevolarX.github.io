"use strict";

function copyOnClick (btn, copy, next) => {
	btn.addEventListener('click', () => {
		const range = document.createRange();
		range.selectNode(copy);
		window.getSelection().addRange(range);
		let ok = false;
		try {
			ok = document.execCommand('copy') || false;
		}
		catch(err) {
			console.error(err);
		}
		window.getSelection().removeAllRanges();
		next(ok);
	});
};