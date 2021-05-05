function Gun (health) {
	this.mAlive = true;
	this.mHealth = health || 100;
	this.mMaxHealth = 100;
	this.mRadius = 50;
	this.mLength = 75;
	this.mHealthBarHeight = 25;
	this.mStartPos = [Math.floor(screenWidth/2), Math.floor(screenHeight/2)];
	this.mEndPos = [this.mStartPos[0], this.mStartPos[1]-length];
};

Gun.prototype.draw = function () {
	// draw health bar.
	this.drawHealthBar();

	// draw barrel of cannon
	ctx.fillStyle = "#FFFFFF";
	var multiplier = 0.5 // Controls cannon width

		
	var deltaX = this.mEndPos[1] - this.mStartPos[1];
	var deltaY = -(this.mEndPos[0] - this.mStartPos[0]);

	var x1 = this.mEndPos[0] + deltaX*multiplier;
	var x2 = this.mEndPos[0] - deltaX*multiplier;
	var y1 = this.mEndPos[1] + deltaY*multiplier;
	var y2 = this.mEndPos[1] - deltaY*multiplier;

	ctx.beginPath();
	ctx.moveTo(this.mStartPos[0], this.mStartPos[1]);
	ctx.lineTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.closePath();
	ctx.fill();

	// draw base of cannon.
	ctx.beginPath();
	ctx.arc(this.mStartPos[0], this.mStartPos[1],this.mRadius,0,2*Math.PI);
	ctx.fill();
	return;
};

Gun.prototype.drawHealthBar = function() {
	var color;

	if (this.mHealth > 75) {
		color = "#00FF00";
	} else if (this.mHealth > 50) {
		color = "#FFF842";
	} else if (this.mHealth > 25) {
		color = "#FF9838";
	} else if (this.mHealth > 0) {
		color = "#FF0000";
	} else {
		color = "#000000";
	}

	ctx.fillStyle = color;
	ctx.fillRect(this.mStartPos[0]-Math.floor((this.mMaxHealth*1.5)/2), this.mStartPos[1]+105, Math.floor(this.mHealth*1.5), this.mHealthBarHeight);
	return
};

Gun.prototype.changeAngle = function (angle) {
	this.mEndPos = [this.mStartPos[0] + Math.floor(this.mLength*Math.cos((angle*Math.PI) / 180)),
					this.mStartPos[1] - Math.floor(this.mLength*Math.sin((angle*Math.PI) / 180))];
	return;
};

Gun.prototype.trackMouse = function () {
	var hypotenuse = Math.sqrt((mousePos[0] - this.mStartPos[0])**2 + (mousePos[1] - this.mStartPos[1])**2);
	var opposite   = mousePos[1] - this.mStartPos[1];

	if (hypotenuse > 0) {
		if (mousePos[0] < screenWidth/2) {
			this.changeAngle((Math.asin(opposite/hypotenuse)*180 / Math.PI)+180);
		} else {
			this.changeAngle(-((Math.asin(opposite/hypotenuse)*180 / Math.PI)));
		}
	}
	return;
};

Gun.prototype.shoot = function() {
	
	var multiplier = 0.25; // controls bullet speed

	var deltaX = this.mEndPos[0] - this.mStartPos[0];
	var deltaY = this.mEndPos[1] - this.mStartPos[1];

	var velocity = [Math.floor(deltaX*multiplier), Math.floor(deltaY*multiplier)];

	var newBullet = new Bullet(this.mEndPos, velocity);

	bulletList.push(newBullet);
	
	return;
};

Gun.prototype.takeDamage = function(amount) {
	if (this.mAlive) {
		this.mHealth -= amount;
		if (this.mHealth <= 0) {
			this.mAlive = false;
			this.mHealth = 0;
		}
	}
};

Gun.prototype.getHealth = function() {
	return this.mHealth;
};

Gun.prototype.setHealth = function(health) {
	if (health < this.mMaxHealth && health >= 0) {
		this.mHealth = health;
		return true;
	}
	return false;
};
