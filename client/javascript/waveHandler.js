function waveHandler() {
	if (((score-(wave*5))%5 == 0) && (score != 0)) {
		if (!waveIncremented) {
			waveIncremented = true;
			wave += 1;
		}
	} else {
		waveIncremented = false;
	}

	var randomNum = randRange(0, Math.abs(150-(5*wave)));

	if (randomNum == 0) {
		enemyList.push(new BasicEnemy());
	}

	return
};