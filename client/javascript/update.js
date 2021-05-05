function update() {
	// Update gun direction.
	gun.trackMouse();
	if (gun.getHealth() == 0) {
		// game over.
		console.log("made it")
		gameOver();
	}

	// Spawn new enemys and keep track of wave.
	waveHandler();

	// Update bullets. Remove dead bullets.
	for (var i = bulletList.length-1; i >= 0; i--) {
		bulletList[i].update();
		if (!bulletList[i].getShouldSpawn()) {
			bulletList.splice(i, 1);
		}
	}

	// Update enemys. Remove dead enemys.
	for (var i = enemyList.length-1; i >= 0; i--) {
		enemyList[i].update();
		if (!enemyList[i].getShouldSpawn()) {
			enemyList.splice(i, 1);
		}
	}
};