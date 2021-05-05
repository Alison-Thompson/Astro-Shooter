import sqlite3
from databaseHandlers.dict_factory import dict_factory
import json

class bulletLists:
	def __init__(self):
		self.mConnection = sqlite3.connect("game_database.db")
		self.mConnection.row_factory = dict_factory
		self.mCursor = self.mConnection.cursor()
		return

	def __del__(self):
		self.mConnection.close()
		return

	def readBulletLists(self):
		self.mCursor.execute("SELECT * FROM bulletLists")
		data = self.mCursor.fetchall()
		for bulletList in data:
			bulletList["bulletList"] = json.loads(bulletList["bulletList"])
		return data

	def readBulletList(self, playerName):
		bulletLists = self.readBulletLists()
		for bulletList in bulletLists:
			if bulletList["playerName"] == playerName:
				self.mCursor.execute("SELECT * FROM bulletLists WHERE playerName = ?", [playerName])
				return self.mCursor.fetchall()

	def createBulletList(self, playerName, bulletList): # bulletList comes in json
		bulletLists = self.readBulletLists()
		for item in bulletLists:
			if item["playerName"] == playerName:
				return False

		self.mCursor.execute("INSERT INTO bulletLists (playerName, bulletList) " +
			"VALUES (?, ?)", [playerName, bulletList])
		self.mConnection.commit()
		return True

	def updateBulletList(self, playerName, bulletList): # bulletList comes in json
		bulletLists = self.readBulletLists()
		for item in bulletLists:
			if item["playerName"] == playerName:
				self.mCursor.execute("UPDATE bulletLists SET bulletList = ? WHERE playerName = ?",
					[bulletList, playerName])
				self.mConnection.commit()
				return True
		return False

	def deleteBulletList(self, playerName):
		bulletLists = self.readBulletLists()
		for bulletList in bulletLists:
			if bulletList["playerName"] == playerName:
				self.mCursor.execute("DELETE FROM bulletLists WHERE playerName = ?", [playerName])
				self.mConnection.commit()
				return True
		return False

	def deleteBulletLists(self):
		self.mCursor.execute("DELETE FROM bulletLists")
		self.mConnection.commit()
		return True

# CREATE TABLE bulletLists (
# id INTEGER PRIMARY KEY,
# playerName TEXT,
# bulletList TEXT
# );