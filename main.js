var myApp;

//initialization
(function () {
	window.onload = initialize();

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'test-app.js';
	document.head.appendChild(script);

	script.onload = _ => {
		Module.onRuntimeInitialized = _ => {
			myApp = new MyApp();
		};
	};
})();

//for playing animations
function animLoop() {
	if (!myApp) return;
	myApp.render();
	refreshProgressValue()
	window.requestAnimationFrame(animLoop);
}

class MyApp {
	curRead = null;
	launched = false;

	flush() {
		var context = this.canvas.getContext('2d');
		//draw the content image first
		context.putImageData(this.imageData, 0, 0);
	}

	render() {
		this.tvg.resize(this.canvas.width, this.canvas.height);
		this.tvg.update();
		var buffer = this.tvg.render();
		var clampedBuffer = Uint8ClampedArray.from(buffer);
		if (clampedBuffer.length == 0) return;
		this.imageData = new ImageData(clampedBuffer, this.canvas.width, this.canvas.height);
		this.flush();
	}

	loadData(data, filename) {
		var ext = filename.split('.').pop().toLowerCase();
		if (ext == "json") ext = "lottie";
		this.tvg.load(new Int8Array(data), ext, this.canvas.width, this.canvas.height);
		this.filename = filename;
		this.render();
		if (!launched) {
			window.requestAnimationFrame(animLoop);
			launched = true;
		}		
	}

	loadUrl(url) {
		let request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onloadend = _ => {
			if (request.status !== 200) {
				alert("Unable to load an image from url " + url);
				return;
			}
			let name = url.split('/').pop();
			this.loadData(request.response, name);
			showImageCanvas();
		};
	}

	constructor() {
		this.tvg = new Module.TvgTestApp();
		this.canvas = document.getElementById("image-canvas");
	}
}

function initialize() {

}

//main image section
function showImageCanvas() {
	var canvas = document.getElementById("image-canvas");
	var placeholder = document.getElementById("image-placeholder");
	canvas.classList.remove("hidden");
	placeholder.classList.add("hidden");
}