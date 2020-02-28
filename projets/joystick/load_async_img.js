"use strict";

function loadImgAsync(key, url, img, resolve)
{
	img.onload = resolve;
	let res = window.localStorage.getItem(key);
	if (!res)
	{
		let xhr = new XMLHttpRequest(), blob, fileReader = new FileReader();
		xhr.open("GET", url, true);
		xhr.responseType = "arraybuffer";
		xhr.addEventListener("load", () => {
			if (xhr.status === 200) {
				blob = new Blob([xhr.response], {type: "image/png"});
				fileReader.onload = (evt) => {
					let result = evt.target.result;
					img.setAttribute("src", result);
					try {
						localStorage.setItem(key, result);
					}
					catch (e) {
						console.log("Storage failed: " + e);
					}
				};
				fileReader.readAsDataURL(blob);
			}
		}, false);
		xhr.send();
		
	}
	else {
		img.src = res;
	}
}
