import sqlite3
from databaseHandlers.dict_factory import dict_factory
import json

class enemyLists:
	def __init__(self):
		self.mConnection = sqlite3.connect("game_database.db")
		self.mConnection.row_factory = dict_factory
		self.mCursor = self.mConnection.cursor()
		return

	def __del__(self):
		self.mConnection.close()
		return

	def readEnemyLists(self):
		self.mCursor.execute("SELECT * FROM enemyLists")
		data = self.mCursor.fetchall()
		for enemyList in data:
			enemyList["enemyList"] = json.loads(enemyList["enemyList"])
		return data

	def readEnemyList(self, playerName):
		enemyLists = self.readEnemyLists()
		for enemyList in enemyLists:
			if enemyList["playerName"] == playerName:
				self.mCursor.execute("SELECT * FROM enemyLists WHERE playerName = ?", [playerName])
				return self.mCursor.fetchall()

	def createEnemyList(self, playerName, enemyList): # enemyList comes in json
		enemyLists = self.readEnemyLists()
		for item in enemyLists:
			if item["playerName"] == playerName:
				return False

		self.mCursor.execute("INSERT INTO enemyLists (playerName, enemyList) " +
			"VALUES (?, ?)", [playerName, enemyList])
		self.mConnection.commit()
		return True

	def updateEnemyList(self, playerName, enemyList): # enemyList comes in json
		enemyLists = self.readEnemyLists()
		for item in enemyLists:
			if item["playerName"] == playerName:
				self.mCursor.execute("UPDATE enemyLists SET enemyList = ? WHERE playerName = ?",
					[enemyList, playerName])
				self.mConnection.commit()
				return True
		return False

	def deleteEnemyList(self, playerName):
		enemyLists = self.readEnemyLists()
		for enemyList in enemyLists:
			if enemyList["playerName"] == playerName:
				self.mCursor.execute("DELETE FROM enemyLists WHERE playerName = ?", [playerName])
				self.mConnection.commit()
				return True
		return False

	def deleteEnemyLists(self):
		self.mCursor.execute("DELETE FROM enemyLists")
		self.mConnection.commit()
		return True


# CREATE TABLE enemyLists (
# id INTEGER PRIMARY KEY,
# playerName TEXT,
# enemyList TEXT
# );