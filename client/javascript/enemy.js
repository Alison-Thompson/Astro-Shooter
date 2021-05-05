function Enemy() {
	this.mShouldSpawn = true;
	this.mVelocity;
};

Enemy.prototype.generatePos = function() {
	var farthestAway = 100; // farthest from screen enemy can spawn
	var buff = 10; // how close to the edge of the screen enemys can spawn

	var x;
	var y;

	var sections = [0, 1, 2, 3, 4, 5, 6, 7];
	var section = randRange(0, 7);

	switch(section) {
		case 0:
			x = randRange(-farthestAway, -buff);
			y = randRange(-farthestAway, -buff);
			break;
		case 1:
			x = randRange(0, screenWidth);
			y = randRange(-farthestAway, -buff);
			break;
		case 2:
			x = randRange(screenWidth+buff, screenWidth+farthestAway)
			y = randRange(-farthestAway, -buff)
		case 3:
			x = randRange(-farthestAway, -buff);
			y = randRange(0, screenHeight);
			break;
		case 4:
			x = randRange(screenWidth+buff, screenWidth+farthestAway);
			y = randRange(0, screenHeight);
			break;
		case 5:
			x = randRange(-farthestAway, -buff);
			y = randRange(screenHeight+buff, screenHeight+farthestAway);
			break;
		case 6:
			x = randRange(0, screenWidth);
			y = randRange(screenHeight+buff, screenHeight+farthestAway);
			break;
		case 7:
			x = randRange(screenWidth+buff, screenWidth+farthestAway);
			y = randRange(screenHeight+buff, screenHeight+farthestAway);
			break;
		default:
			console.log("Something went wrong in the enemy position generator.");
	}

	return [x, y];
};

Enemy.prototype.getShouldSpawn = function() {
	return this.mShouldSpawn;
};

Enemy.prototype.setShouldSpawn = function(value) {
	this.mShouldSpawn = value;
};

Enemy.prototype.setPos = function(value) {
	this.mPos = value;
};

Enemy.prototype.setVelocity = function(value) {
	this.mVelocity = value;
};