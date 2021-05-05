function tick() {
	if (!isGameOver) {
		window.requestAnimationFrame(tick);

		currentTick = Date.now();
		var delta = currentTick-lastTick;
		var interval = 1000/fps;

		if ((delta > interval) && (!paused)) {
			lastTick = currentTick - (delta%interval)
			// Draw the frame
			draw();
			update();
		}
	}
};