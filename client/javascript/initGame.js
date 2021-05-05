function initGame() {

	// Remove start game listener
	document.removeEventListener("keyup", initHelper);

	// Create canvas
	screenWidth = window.innerWidth;
	screenHeight = window.innerHeight;

	var body = document.querySelector("#body");
	body.removeChild(body.firstChild);
	canvas = document.createElement("canvas");
	canvas.width = screenWidth;
	canvas.height = screenHeight;
	body.appendChild(canvas);

	// Make sure canvas auto resizes to screen
	window.addEventListener("resize", function () {
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight;

		canvas.width = screenWidth;
		canvas.height = screenHeight;
	});

	// Set up drawing context
	ctx = canvas.getContext("2d");

	// start game
	gun = new Gun(initPlayerHealth);
	
	if (!playAgain) {
		getInput();
	}
	

	waveIncremented = false;
	paused = false;
	isGameOver = false;

	fps = 60;
	lastTick = Date.now();

	tick();
}
