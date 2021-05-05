function gameOver() {
	server.delete("/players/"+playerName);
	server.delete("/bulletLists/"+playerName);
	server.delete("/enemyLists/"+playerName);
	playerNameEncoded = encodeURIComponent(playerName);
	scoreEncoded = encodeURIComponent(score);
	waveEncoded = encodeURIComponent(wave);
	saveHighscoreBody = "playerName="+playerNameEncoded+"&score="+scoreEncoded+"&wave="+waveEncoded;

	body = document.querySelector("#body");
	body.removeChild(canvas);
	isGameOver = true;

	var flag = false;
	server.get("/highscores", function(data) {
		for (var i = 0; i < data.length; i++) {
			if ((data[i]["playerName"] == playerName)) {
				var flag = true;
				// update the highscore.
				if (data[i]["score"] < score) {
					server.put("/highscores/"+playerName, saveHighscoreBody, function(response) {
						loadHighscores(data);
						return;
					});
				} else {
					loadHighscores(data);
					return;
				}
			} 
		}
		// make new highscore.
		if (!flag) {
			server.post("/highscores", saveHighscoreBody, function(response) {
				loadHighscores(data);
				return;
			});
		}
	});
};