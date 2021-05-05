function startup() {
	// Tell program this is first time through.
	playAgain = false;

	server.get("/players", function (data) {
		server.get("/sessions", function (sessionData) {
			var hasCurrentGame = false;
			currentPlayerName = sessionData["username"];

			clearPage();
			var body = document.querySelector("#body");
			var logoutButton = document.createElement("button");
			var logoutButtonTextNode = document.createTextNode("Log Out");
			logoutButton.setAttribute("id", "logout-button");
			logoutButton.appendChild(logoutButtonTextNode);
			body.appendChild(logoutButton);
			logoutButton.addEventListener("click", function () {
		    	logout();
		    });

			var header = document.createElement("h1");
			var headerTextNode = document.createTextNode("Welcome " + sessionData["firstName"] + ", please choose an option.");
			header.setAttribute("id", "header");
			header.appendChild(headerTextNode);
			body.appendChild(header);

			for(var i = 0; i < data.length; i++) {
				if (data[i]["playerName"] == currentPlayerName) { // Has a current game
					hasCurrentGame = true;
					loadGameOption(currentPlayerName);
				}
			}
			
			var oldLoadGameButton = document.querySelector("#load-game");
			if ((!hasCurrentGame) && oldLoadGameButton) {
				var body = document.querySelector("#body");
				body.removeChild(oldLoadGameButton);
			}

			var oldNewGameButton = document.querySelector("#start-new-game-center");
			if (hasCurrentGame && oldNewGameButton) {
				var body = document.querySelector("#body");
				body.removeChild(oldNewGameButton);
			}

			newGameOption(currentPlayerName, hasCurrentGame);
		});
	}, function(response) {
		if (response.status == 401) {
			// show login page.
			displayLoginPage();
		}
	});
	return;
};

function logout(currentPlayerName) {
	server.delete("/sessions");
	displayLoginPage();
};

function resetPlayerData(currentPlayerName) {
	playerBody = "health=100&score=0&wave=1";
	bulletListBody = "bulletList="+JSON.stringify([]);
	enemyListBody = "enemyList="+JSON.stringify([]);
	server.put("/players/"+currentPlayerName, playerBody);
	server.put("/bulletLists/"+currentPlayerName, bulletListBody);
	server.put("/enemyLists/"+currentPlayerName, enemyListBody);
	return;
};

function createNewPlayer(currentPlayerName) {
	playerNameEncoded = encodeURIComponent(currentPlayerName)
	playerBody = "playerName="+playerNameEncoded+"&health=100&score=0&wave=1";
	bulletListBody = "playerName="+playerNameEncoded+"&bulletList=[]";
	enemyListBody = "playerName="+playerNameEncoded+"&enemyList=[]";
	server.post("/players", playerBody);
	server.post("/bulletLists", bulletListBody);
	server.post("/enemyLists", enemyListBody);
	return
};

function loadGameOption(currentPlayerName) { // make sure you start the game after button push
	var body = document.querySelector("#body");
	var oldButton = document.querySelector("#load-game");
	if (oldButton) {
		body.removeChild(oldButton);
	}
	
	var newGameButton = document.createElement("button");
    var newGameButtonTextNode = document.createTextNode("Load old save");
    newGameButton.appendChild(newGameButtonTextNode);
    newGameButton.setAttribute("id", "load-game");
    newGameButton.addEventListener("click", function () {
    	retrieveDataAndStartGame(currentPlayerName, true);
    });
    body.appendChild(newGameButton);
};

function newGameOption(currentPlayerName, hasCurrentGame) { // make sure you start the game after button push
	var body = document.querySelector("#body");
	var oldButton = document.querySelector("#start-new-game");
	if (oldButton) {
		body.removeChild(oldButton);
	}
	
	var newGameButton = document.createElement("button");
    var newGameButtonTextNode = document.createTextNode("Start new save");
    newGameButton.appendChild(newGameButtonTextNode);
    if (hasCurrentGame) {
    	newGameButton.setAttribute("id", "start-new-game");
    } else {
    	newGameButton.setAttribute("id", "start-new-game-center");
    }
    newGameButton.addEventListener("click", function () {
    	if (hasCurrentGame) {
    		// delete current game then make player game.
    		resetPlayerData(currentPlayerName);
    		retrieveDataAndStartGame(currentPlayerName, false);
    	} else {
    		// make new player game.
    		createNewPlayer(currentPlayerName);
    		retrieveDataAndStartGame(currentPlayerName, false);
    	}
    });
    body.appendChild(newGameButton);
};

function print(message, element, interval) {
	for (var i = 0; i < message.length; i++) {
		printHelper(message, element, i, interval);
	}

};

function printHelper(message, element, iterator, interval) {
	var h1 = element;
	setTimeout(function() {
		h1.textContent += message.charAt(iterator);
	}, interval*iterator);
};

function initHelper(event) {
	event.preventDefault();
	if (event.keyCode === 32) {
		initGame();
	}
};

function retrieveDataAndStartGame(currentPlayerName, load) {
	if (load) {
		playerName = currentPlayerName;
		server.get("/players/"+playerName, function(data) {
			score = data[0]["score"];
			wave = data[0]["wave"];
			initPlayerHealth = data[0]["health"]
		});
		server.get("/bulletLists/"+playerName, function(data) {
			bulletListPacked = JSON.parse(data[0]["bulletList"]);
			if (!bulletListPacked) { // No data to begin with.
				bulletList = [];
			} else {
				bulletList = [];
				for (var i = 0; i < bulletListPacked.length; i++) {
					bulletList.push(new Bullet(bulletListPacked[i]["position"],
											   bulletListPacked[i]["velocity"]));
				}
			}
		});
		server.get("/enemyLists/"+playerName, function(data) {
			enemyListPacked = JSON.parse(data[0]["enemyList"]);
			if (!enemyListPacked) { // No data to begin with.
				enemyList = [];
			} else { // may need to support new enemy types here.
				enemyList = [];
				for (var i = 0; i < enemyListPacked.length; i++) {
					enemyList.push(new BasicEnemy(enemyListPacked[i]["position"],
												  enemyListPacked[i]["health"],
												  enemyListPacked[i]["first"],
												  enemyListPacked[i]["flag"]));
				}
			}
		});
	} else {
		playerName = currentPlayerName;
		score = 0;
		wave = 1;
		initPlayerHealth = 100;
		bulletList = [];
		enemyList = [];
	}

	var body = document.querySelector("#body");
	while(body.firstChild) {
		body.removeChild(body.lastChild);
	}

	var h1 = document.createElement("h1");
	var h1Text = document.createTextNode("");
	body.appendChild(h1);
	h1.appendChild(h1Text);
	h1.setAttribute("id", "printed-message");

	var message1 = "Ready Player One?";
	var message2 = "Press space to start.";
	var interval = 70; // change printing speed here.
	var intervalBetweenTwoMessages = 2000;

	print(message1, h1, interval);

	var h1 = document.createElement("h1");
	var h1Text = document.createTextNode("");
	body.appendChild(h1);
	h1.appendChild(h1Text);
	h1.setAttribute("id", "printed-message");

	setTimeout(function() {
		body.removeChild(body.firstChild);
		print(message2, h1, interval);
		setTimeout(function () {
			document.addEventListener("keyup", initHelper);
		}, interval*message2.length)
	}, (interval*(message1.length))+intervalBetweenTwoMessages);

};
