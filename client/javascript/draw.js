function draw() {
	// clear last
	ctx.clearRect(0, 0, screenWidth, screenHeight)

	// draw bullets
	for (var i = 0; i < bulletList.length; i++) {
		bulletList[i].draw();
	}

	// draw enemys
	for (var i = 0; i < enemyList.length; i++) {
		enemyList[i].draw();
	}

	// draw gun
	gun.draw();

	// draw score and wave
	ctx.fillStyle = "#35ce27";
	ctx.font = "30px Times";
	ctx.fillText("Wave: " + wave,20,30);
	ctx.fillText("Score: " + score,20,65);
};