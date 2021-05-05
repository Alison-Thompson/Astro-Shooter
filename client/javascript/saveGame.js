function saveGame() {
	var saveHealth = encodeURIComponent(gun.getHealth());
	var saveScore = encodeURIComponent(score);
	var saveWave = encodeURIComponent(wave);

	var saveBulletList = JSON.stringify(bulletListToObjectList());
	var saveEnemyList = JSON.stringify(enemyListToObjectList());

	playerBody = "health="+saveHealth+"&score="+saveScore+"&wave="+saveWave;
	bulletListBody = "bulletList="+encodeURIComponent(saveBulletList);
	enemyListBody = "enemyList="+encodeURIComponent(saveEnemyList);
	server.put("/players/"+playerName, playerBody);
	server.put("/bulletLists/"+playerName, bulletListBody);
	server.put("/enemyLists/"+playerName, enemyListBody);
	return;
};

function bulletListToObjectList() {
	var array = [];
	for (var i = 0; i < bulletList.length; i++) {
		var object = {};
		object["position"] = bulletList[i].getPos();
		object["velocity"] = bulletList[i].getVelocity();
		array.push(object);
	}
	return array;
};

function enemyListToObjectList() {
	var array = [];
	for (var i = 0; i < enemyList.length; i++) {
		var object = {};
		object["position"] = enemyList[i].getPos();
		object["health"] = enemyList[i].getHealth();
		object["first"] = enemyList[i].getFirst();
		object["flag"] = enemyList[i].getFlag();
		array.push(object);
	}
	return array;
};