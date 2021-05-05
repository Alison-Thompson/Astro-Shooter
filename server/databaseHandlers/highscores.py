import sqlite3
from databaseHandlers.dict_factory import dict_factory

class highscores:
	def __init__(self):
		self.mConnection = sqlite3.connect("game_database.db")
		self.mConnection.row_factory = dict_factory
		self.mCursor = self.mConnection.cursor()
		return

	def __del__(self):
		self.mConnection.close()
		return

	def readHighscores(self):
		self.mCursor.execute("SELECT * FROM highscores")
		return self.mCursor.fetchall()

	def readHighscore(self, playerName):
		self.mCursor.execute("SELECT * FROM highscores WHERE playerName = ?", [playerName])
		return self.mCursor.fetchall()

	def createHighscore(self, playerName, score, wave):
		highscores = self.readHighscores()
		for highscore in highscores:
			if highscore["playerName"] == playerName:
				return False

		self.mCursor.execute("INSERT INTO highscores (playerName, score, wave) " +
			"VALUES (?, ?, ?)", [playerName, score, wave])
		self.mConnection.commit()
		return True

	def updateHighscore(self, playerName, score, wave):
		highscores = self.readHighscores()
		for highscore in highscores:
			if highscore["playerName"] == playerName:
				self.mCursor.execute("UPDATE highscores SET score = ?, wave = ? " +
					"WHERE playerName = ?", [score, wave, playerName])
				self.mConnection.commit()
				return True
		return False

	def deleteHighscore(self, playerName):
		highscores = self.readHighscores()
		for highscore in highscores:
			if highscore["playerName"] == playerName:
				self.mCursor.execute("DELETE FROM highscores WHERE playerName = ?", [playerName])
				self.mConnection.commit()
				return True
		return False

	def deleteHighscores(self):
		self.mCursor.execute("DELETE FROM highscores")
		self.mConnection.commit()
		return True



# CREATE TABLE highscores (
# id INTEGER PRIMARY KEY,
# playerName TEXT,
# score INTEGER,
# wave INTEGER
# );