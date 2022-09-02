class Ajax {
	
	constructor(options) {
		const opt = {
			mimeType: 'application/json',
			mode: 'same-origin',
			credentials: 'include'
		};
		this.options = {
			...opt,
			...options
		};
		this.headers = new Headers();
		this.headers.setHeader('Content-Type', `${this.options.mimeType}; charset=utf-8`);
	}
	
	setHeader(key, val) {
		this.headers.setHeader(key, val);
	}
	
	route(method, url, obj = null) {
		const body = obj !== null ? JSON.stringify(obj) : null;
		const myInit = {
			method,
			headers: this.headers,
			body,
			mode: this.options.mode,
			credentials: this.options.credentials
		};
		const req = new Request(url, myInit);
		return fetch(req);
	}
	
	get(url, obj = null) {
		return this.route('GET', url, obj);
	}
	
	head(url, obj = null) {
		return this.route('HEAD', url, obj);
	}
	
	post(url, obj = null) {
		return this.route('POST', url, obj);
	}
	
	put(url, obj = null) {
		return this.route('PUT', url, obj);
	}
	
	delete(url, obj = null) {
		return this.route('DELETE', url, obj);
	}
	
	connect(url, obj = null) {
		return this.route('CONNECT', url, obj);
	}
	
	options(url, obj = null) {
		return this.route('OPTIONS', url, obj);
	}
	
	trace(url, obj = null) {
		return this.route('TRACE', url, obj);
	}
	
	patch(url, obj = null) {
		return this.route('PATCH', url, obj);
	}
	
}

window.addEventListener('unload', () => { navigator.sendBeacon("/logout", userData); }, false);

