import sqlite3
from databaseHandlers.dict_factory import dict_factory

class users:
	def __init__(self):
		self.mConnection = sqlite3.connect("game_database.db")
		self.mConnection.row_factory = dict_factory
		self.mCursor = self.mConnection.cursor()
		return

	def __del__(self):
		self.mConnection.close()
		return

	def readUsers(self):
		self.mCursor.execute("SELECT * FROM users")
		return self.mCursor.fetchall()

	def readUser(self, id):
		self.mCursor.execute("SELECT * FROM users WHERE id = ?", [id])
		return self.mCursor.fetchone()

	def getUserByUsername(self, username):
		users = self.readUsers()
		for i in range(len(users)):
			if users[i]["username"] == username:
				self.mCursor.execute("SELECT * FROM users WHERE username = ?", [username])
				return self.mCursor.fetchone()
		return None

	def createUser(self, username, email, hashedPassword, firstName, lastName):
		self.mCursor.execute("SELECT * FROM users")
		users = self.mCursor.fetchall()
		for user in users:
			if user["username"] == username or user["email"] == email: # already has an account.
				return False

		self.mCursor.execute("INSERT INTO users (username, email, hashedPassword, firstName, lastName) " +
			"VALUES (?, ?, ?, ?, ?)", [username, email, hashedPassword, firstName, lastName])
		self.mConnection.commit()
		return True

	def deleteUsers(self):
		self.mCursor.execute("DELETE FROM users")
		self.mConnection.commit()
		return True


# CREATE TABLE users (
# 	id INTEGER PRIMARY KEY,
# 	username TEXT,
# 	email TEXT,
# 	hashedPassword TEXT,
# 	firstName TEXT,
# 	lastName TEXT
# );