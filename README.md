# Astro Blaster
## Resources

The main resource for this project is the player data in the game.
 Although different routes are used to store some of the player data, bulletLists and EnemyLists,
 they are still just part of the main resource. The attributes of the player data resource are: playerName, wave, score,
 bulletList, and enemyList.

The secondary resource used in this project is highscores. This is a more permanent storage of the players data
 after they finish a game. This data remains until the user deletes it.

 This project also supports users accounts that can be logged into and sessions to keep the user logged in.

## Database Schemas

The following is the database schemas for impemented routes.

CREATE TABLE players (
	id INTEGER PRIMARY KEY,
	playerName TEXT,
	health INTEGER,
	score INTEGER,
	wave INTEGER
);

CREATE TABLE bulletLists (
	id INTEGER PRIMARY KEY,
	playerName TEXT,
	bulletList TEXT
);

CREATE TABLE enemyLists (
	id INTEGER PRIMARY KEY,
	playerName TEXT,
	enemyList TEXT
);

CREATE TABLE highscores (
	id INTEGER PRIMARY KEY,
	playerName TEXT,
	score INTEGER,
	wave INTEGER
);

CREATE TABLE users (
	id INTEGER PRIMARY KEY,
	username TEXT,
	email TEXT,
	hashedPassword TEXT,
	firstName TEXT,
	lastName TEXT
);

## Rest Endpoints

The following are the implemented rest endpoints.

|                                              | GET                           | POST                   | PUT                | DELETE                    |
|----------------------------------------------|-------------------------------|------------------------|--------------------|---------------------------|
| http://localhost:8080/players                | List All Players              | Create New Player      | Not Implemented    | Delete All Players        |
| http://localhost:8080/players/playerName     | Retrieve Player               | Not Implemented        | Update Player      | Delete Single Player      |
| http://localhost:8080/bulletLists            | List All Bullet Lists         | Create New Bullet List | Not Implemented    | Delete All Bullet Lists   |
| http://localhost:8080/bulletLists/playerName | Retrieve Bullet List          | Not Implemented        | Update Bullet List | Delete Single Bullet List |
| http://localhost:8080/enemyLists             | List All Enemy Lists          | Create New             | Not Implemented    | Delete All Enemy Lists    |
| http://localhost:8080/enemyLists/playerName  | Retrieve Enemy List           | Not Implemented        | Update Enemy List  | Delete Single Enemy List  |
| http://localhost:8080/highscores             | List All Highscores           | Create New Highscore   | Not Implemented    | Delete All Highscores     |
| http://localhost:8080/highscores/playerName  | Retrieve Highscore            | Not Implemented        | Update Highscore   | Delete Single Highscore   |
| http://localhost:8080/users                  | Not Implemented               | Create New User        | Not Implemented    | Delete All Users          |
| http://localhost:8080/sessions               | Retrieve Current Session Data | Create Session         | Not Implemented    | Not Implemented           |