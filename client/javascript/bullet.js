function Bullet(pos, velocity) {
	this.mPos = pos;
	this.mRadius = 5;
	this.mVelocity = velocity;
	this.mShouldSpawn = true;
	return;
};

Bullet.prototype.getShouldSpawn = function() {
	return this.mShouldSpawn;
};

Bullet.prototype.getPos = function() {
	return this.mPos;
};

Bullet.prototype.getVelocity = function () {
	return this.mVelocity;
};

Bullet.prototype.setShouldSpawn = function(value) {
	this.mShouldSpawn = value;
	return;
};

Bullet.prototype.update = function() {
	this.mPos = [this.mPos[0] + this.mVelocity[0],
				 this.mPos[1] + this.mVelocity[1]]
	if ((this.mPos[0] > screenWidth)  || (this.mPos[0] < 0) ||
		(this.mPos[1] > screenHeight) || (this.mPos[1] < 0)) {
		this.mShouldSpawn = false;
	}
	return;
};

Bullet.prototype.draw = function() {
	ctx.fillStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.arc(this.mPos[0], this.mPos[1],this.mRadius,0,2*Math.PI);
	ctx.fill();
	return;
};