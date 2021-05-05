function getInput() {
	mousePos = [0,0];

	// save button stuff
	var width = 100;
	var height = 55;
	var buffer = 20;
	var textBufferY = 18;
	var textBufferX = 20;
	var overSave = false

	document.addEventListener('mousemove', function(event) {
		if (!isGameOver) {
			var rect = canvas.getBoundingClientRect();
			mousePos[0] = event.clientX-rect.left;
			mousePos[1] = event.clientY-rect.top;
			if ((mousePos[0] > screenWidth-(width+buffer)) &&
				(mousePos[0] < (screenWidth-(width+buffer))+width) &&
				(mousePos[1] > buffer) &&
				(mousePos[1] < buffer+height)) {
				canvas.style.cursor = "pointer";
				overSave = true;
			} else {
				canvas.style.cursor = "auto";
				overSave = false;
			}
		}
	}, false)

	document.onmousedown = function(event) {
		if (!isGameOver) {
			if (event.button == 0) { // left click.
				if (!paused) {
					gun.shoot();
				} else {
					if (overSave) {
						// save game to server
						saveGame();
					}
				}
			}
		}
	};

	document.addEventListener("keyup", function(event) {
		if (!isGameOver) {
			event.preventDefault();
			if (event.keyCode === 32) { // space pressed.
				paused = !paused;
				if (paused) {
					ctx.strokeStyle = "#35ce27";
					ctx.strokeRect(screenWidth-(width+buffer), buffer, width, height);

					ctx.fillStyle = "#35ce27";
					ctx.font = "30px Times";
					ctx.fillText("Save",(screenWidth-(width+buffer))+textBufferX, (buffer+height)-textBufferY);
				}
			}
			if (event.keyCode === 68) { // die. for testing
				gameOver();
			}
		}
	});
}