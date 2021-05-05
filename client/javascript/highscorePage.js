function loadHighscores() {
	// generate the logout button.
	var body = document.querySelector("#body");
	var logoutButton = document.createElement("button");
	var logoutButtonTextNode = document.createTextNode("Log Out");
	logoutButton.setAttribute("id", "logout-button");
	logoutButton.appendChild(logoutButtonTextNode);
	body.appendChild(logoutButton);
	logoutButton.addEventListener("click", function () {
    	logout();
    });

	// generate the header.
	var header = document.createElement("h1");
	var headerTextNode = document.createTextNode("Highscores");
	header.appendChild(headerTextNode);
	header.setAttribute("id", "header");
	body.appendChild(header);

	// get highscores from server.
	var interval = 100;
	server.get("/highscores", function(data) {
		// generate the highscores.
		data = shakerSort(data);
		data = data.slice(0, 10);
		displayHighscores(data, body, interval);

		// generate the footer.
		createFooter(data);
	});
};

function displayHighscores(highscores, element, interval) {
	for (var i = 0; i < highscores.length; i++) {
		displayHighscoresHelper(highscores, element, interval, i);
	}
};

function displayHighscoresHelper(highscores, element, interval, iterator) {
	var container = element;
	setTimeout(function() {
		// create highscore body.
		highscore = document.createElement("div");
		highscore.setAttribute("class", "highscore");

		// create highscore playername.
		playerNameLabel = document.createElement("label");
		playerNameLabelTextNode = document.createTextNode("User: "+highscores[iterator]["playerName"]);
		playerNameLabel.setAttribute("class", "playerName");
		playerNameLabel.appendChild(playerNameLabelTextNode);
		highscore.appendChild(playerNameLabel);

		// create highscore wave.
		waveLabel = document.createElement("label");
		waveLabelTextNode = document.createTextNode("Wave: "+highscores[iterator]["wave"]);
		waveLabel.setAttribute("class", "wave");
		waveLabel.appendChild(waveLabelTextNode);
		highscore.appendChild(waveLabel);

		// create highscore score.
		scoreLabel = document.createElement("label");
		scoreLabelTextNode = document.createTextNode("Score: "+highscores[iterator]["score"]);
		scoreLabel.setAttribute("class", "score");
		scoreLabel.appendChild(scoreLabelTextNode);
		highscore.appendChild(scoreLabel);

		container.appendChild(highscore);
	}, interval*iterator);
};

function createFooter(highscores) {
	// create footer.
	var body = document.querySelector("#body");
	var footer = document.createElement("div");
	footer.setAttribute("id", "footer");
	body.appendChild(footer);

	// see if player has a highscore in top ten.
	var deleteHighscoreOption = false;
	for (var i = 0; i < highscores.length; i++) {
		if (highscores[i]["playerName"] == playerName) {
			// give option to delete highscore.
			deleteHighscoreOption = true;
		}
	}

	if (deleteHighscoreOption) { // remember to add event listeners.
		var deleteHighscoreButton = document.createElement("button");
		var deleteHighscoreButtonTextNode = document.createTextNode("Delete Highscore");
		deleteHighscoreButton.setAttribute("id", "delete-highscore-left");
		deleteHighscoreButton.appendChild(deleteHighscoreButtonTextNode);
		deleteHighscoreButton.addEventListener("click", function () {
			// delete the highscore and reload this page.
			server.delete("/highscores/"+playerName, function () {
				clearPage();
				loadHighscores();
			});
		});
		footer.appendChild(deleteHighscoreButton);

		var playAgainButton = document.createElement("button");
		var playAgainButtonTextNode = document.createTextNode("Play Again");
		playAgainButton.setAttribute("id", "play-again-right");
		playAgainButton.appendChild(playAgainButtonTextNode);
		playAgainButton.addEventListener("click", playAgainFunction);
		footer.appendChild(playAgainButton);
	} else { // remember to add event listener.
		var playAgainButton = document.createElement("button");
		var playAgainButtonTextNode = document.createTextNode("Play Again");
		playAgainButton.setAttribute("id", "play-again-middle");
		playAgainButton.appendChild(playAgainButtonTextNode);
		playAgainButton.addEventListener("click", playAgainFunction)
		footer.appendChild(playAgainButton);
	}
};

function playAgainFunction() {
	playAgain = true;
	createNewPlayer(playerName);
	retrieveDataAndStartGame(playerName, false);
};

function clearPage() {
	var body = document.querySelector("#body");
	while (body.firstChild) {
		body.removeChild(body.lastChild);
	}
};