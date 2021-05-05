function BasicEnemy(pos, health, first, flag) {
	Enemy.call(this);

	this.mPos = pos || this.generatePos();

	this.mHealth = health || 10;

	this.mWidth = 50;
	this.mHeight = 50;

	this.mDamageToPlayer = 10;

	this.mFirst = first || true;
	this.mFlag = flag || true;
	this.mAlive = true;
	this.mDistance;
};

BasicEnemy.prototype = new Enemy();

BasicEnemy.prototype.getPos = function() {
	return this.mPos;
};

BasicEnemy.prototype.getHealth = function() {
	return this.mHealth;
};

BasicEnemy.prototype.getFirst = function() {
	return this.mFirst;
};

BasicEnemy.prototype.getFlag = function() {
	return this.mFlag;
};

BasicEnemy.prototype.draw = function() {
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(this.mPos[0], this.mPos[1], this.mWidth, this.mHeight);
	return;
};

BasicEnemy.prototype.update = function () {

	var multiplier = 0.012;

	var playerX = Math.floor(screenWidth/2);
	var playerY = Math.floor(screenHeight/2);

	var newDistance = Math.sqrt((playerX - this.mPos[0])**2 + (playerY - this.mPos[1])**2);

	if (this.mFlag) {
		

		var deltaY = playerY - this.mPos[1];
		var deltaX = playerX - this.mPos[0];

		deltaY *= multiplier;
		deltaX *= multiplier;

		this.mPos = [this.mPos[0] + deltaX, this.mPos[1] + deltaY];

		if (this.mFirst) {
			this.mFirst = false;
			this.mDistance = newDistance;
		}

		if (this.mFlag && newDistance <= this.mDistance/2) {
			this.mFlag = false;
			this.mVelocity = [deltaX, deltaY];
		}

	} else {
		if (!(newDistance <= 60)) {
			this.mPos = [this.mPos[0] + this.mVelocity[0], this.mPos[1] + this.mVelocity[1]];
		} else { // Hit player
			if (this.mAlive) {
				this.mAlive = false;
				this.setShouldSpawn(false);
				// do damage to player here
				gun.takeDamage(this.mDamageToPlayer);
			}
		}
	}

	this.hitHandler()
	return;
};

BasicEnemy.prototype.hitHandler = function() {
	var radius = 5;
	var size = this.mWidth;

	if (this.mAlive) {
		for (var i = 0; i < bulletList.length; i++) {
			pos = bulletList[i].getPos();
			if ((pos[0] >= this.mPos[0]) && (pos[0] <= this.mPos[0]+size) &&
			   (pos[1] >= this.mPos[1]) && (pos[1] <= this.mPos[1]+size)) {
			   // Hit enemy
			   this.mAlive = false;
			   this.setShouldSpawn(false);
			   bulletList[i].setShouldSpawn(false);
			   this.mHealth -= 10;
			   score += 1;
			}
		}
	}
	return;
};