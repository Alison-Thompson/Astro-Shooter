import sqlite3
from databaseHandlers.dict_factory import dict_factory

class players:
	def __init__(self):
		self.mConnection = sqlite3.connect("game_database.db")
		self.mConnection.row_factory = dict_factory
		self.mCursor = self.mConnection.cursor()

		self.mMaxHealth = 100
		self.mMinHealth = 0
		self.mMinScore = 0
		self.mMinWave = 0
		return

	def __del__(self):
		self.mConnection.close()
		return

	def readPlayers(self):
		self.mCursor.execute("SELECT * FROM players")
		return self.mCursor.fetchall()

	def readPlayer(self, playerName):
		players = self.readPlayers()
		for i in range(len(players)):
			if players[i]["playerName"] == playerName:
				self.mCursor.execute("SELECT * FROM players WHERE playerName = ?", [playerName])
				return self.mCursor.fetchall()
		return None

	def createPlayer(self, playerName, health, score, wave): # returns true if created false if not.
		if health >= self.mMinHealth and health <= self.mMaxHealth and score >= self.mMinScore and wave >= self.mMinWave:
			players = self.readPlayers()
			for i in range(len(players)):
				if players[i]["playerName"] == playerName:
					return False
			
			self.mCursor.execute("INSERT INTO players (playerName, health, score, wave)" +
				"VALUES (?, ?, ?, ?)",
				[playerName, health, score, wave])
			self.mConnection.commit()
			return True
		else:
			return False

	def updatePlayerHealth(self, playerName, health):
		if health >= self.mMinHealth and health <= self.mMaxHealth:
			players = self.readPlayers()
			for i in range(len(players)):
				if players[i]["playerName"] == playerName:
					self.mCursor.execute("UPDATE players SET health = ? WHERE playerName = ?", [health, playerName])
					self.mConnection.commit()
					return True
		else:
			return False

	def updatePlayerScore(self, playerName, score):
		if score >= self.mMinScore:
			players = self.readPlayers()
			for i in range(len(players)):
				if players[i]["playerName"] == playerName:
					self.mCursor.execute("UPDATE players SET score = ? WHERE playerName = ?", [score, playerName])
					self.mConnection.commit()
					return True
		else:
			return False

	def updatePlayerWave(self, playerName, wave):
		if wave >= self.mMinWave:
			players = self.readPlayers()
			for i in range(len(players)):
				if players[i]["playerName"] == playerName:
					self.mCursor.execute("UPDATE players SET wave = ? WHERE playerName = ?", [wave, playerName])
					self.mConnection.commit()
					return True
		else:
			return False

	def deletePlayer(self, playerName):
		flag = False
		players = self.readPlayers()
		for i in range(len(players)):
			if players[i]["playerName"] == playerName:
				flag = True
				self.mCursor.execute("DELETE FROM players WHERE playerName = ?", [playerName])
				self.mConnection.commit()

		return flag

	def deletePlayers(self):
		self.mCursor.execute("DELETE FROM players")
		self.mConnection.commit()
		return True

# CREATE TABLE players (
# id INTEGER PRIMARY KEY,
# playerName TEXT,
# health INTEGER,
# score INTEGER,
# wave INTEGER
# );