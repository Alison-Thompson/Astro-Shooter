# External
from threading import Thread
from socketserver import ThreadingMixIn

from http.server import HTTPServer, BaseHTTPRequestHandler
from http import cookies
from urllib.parse import parse_qs
import bcrypt
import json
import sys

# Internal
import databaseHandlers
import sessionStore
import shakerSort

globalSessionStore = sessionStore.SessionStore()

class Server(BaseHTTPRequestHandler):

	def do_GET(self):
		# use this for finding if they're logged in.
		# if "userID" in self.mSession:


		self.loadSession()
		if self.path == "/players": # list all players
			self.handleListPlayers()
			
		elif self.path == "/highscores": # list all highscores
			self.handleListHighscores()
			
		elif self.path == "/bulletLists": # list all bulletLists
			self.handleListBulletLists()
			
		elif self.path == "/enemyLists": # list all enemyLists
			self.handleListEnemyLists()

		elif self.path == "/sessions":
			self.handleRetrieveSession()

		elif self.path.split("/")[1] == "players": # list a single player
			self.handleRetrievePlayer()
			
		elif self.path.split("/")[1] == "highscores": # list a single highscore
			self.handleRetrieveHighscore()
			
		elif self.path.split("/")[1] == "bulletLists": # list a single bulletList
			self.handleRetrieveBulletList()
			
		elif self.path.split("/")[1] == "enemyLists": # list a single enemyList
			self.handleRetrieveEnemyList()
			
		else:
			self.handleNotFound()

		return

	def do_POST(self):
		self.loadSession()
		if self.path == "/players":
			self.handleCreatePlayer()

		elif self.path == "/highscores":
			self.handleCreateHighscore()

		elif self.path == "/bulletLists":
			self.handleCreateBulletList()

		elif self.path == "/enemyLists":
			self.handleCreateEnemyList()

		elif self.path == "/users":
			self.handleCreateUser()

		elif self.path == "/sessions":
			self.handleCreateSession()

		else:
			self.handleNotFound()

		return

	def do_PUT(self):
		self.loadSession()
		if self.path.split("/")[1] == "players":
			self.handleUpdatePlayer()
			
		elif self.path.split("/")[1] == "highscores":
			self.handleUpdateHighscore()
			
		elif self.path.split("/")[1] == "bulletLists":
			self.handleUpdateBulletList()
			
		elif self.path.split("/")[1] == "enemyLists":
			self.handleUpdateEnemyList()
			
		else:
			self.handleNotFound()

		return

	def do_DELETE(self):
		self.loadSession()
		if self.path == "/players":
			self.handleDeletePlayers()

		elif self.path == "/highscores":
			self.handleDeleteHighscores()

		elif self.path == "/bulletLists":
			self.handleDeleteBulletLists()

		elif self.path == "/enemyLists":
			self.handleDeleteEnemyLists()

		elif self.path == "/users":
			self.handleDeleteUsers()

		elif self.path == "/sessions":
			self.handleLogout()

		elif self.path.split("/")[1] == "players":
			self.handleDeletePlayer()

		elif self.path.split("/")[1] == "highscores":
			self.handleDeleteHighscore()

		elif self.path.split("/")[1] == "bulletLists":
			self.handleDeleteBulletList()

		elif self.path.split("/")[1] == "enemyLists":
			self.handleDeleteEnemyList()

		else:
			self.handleNotFound()

		return

	def do_OPTIONS(self):
		self.loadSession()
		self.send_response(200)
		self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		self.send_header("Access-Control-Allow-Headers", "Origin, Content-Type")
		# self.send_header("Access-Control-Allow-Headers", "Content-Type") maybe do this instead of above.
		try:
			self.end_headers()

		except BrokenPipeError:
			self.finish()
		return

	# Override end_headers so it sends our cookie.
	def end_headers(self):
		self.sendCookie()
		self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
		self.send_header("Access-Control-Allow-Credentials", "true")
		BaseHTTPRequestHandler.end_headers(self)
		return

	# Cookies

	def loadCookie(self):
		if "Cookie" in self.headers:
			# If there's a cookie load it into a data member.
			self.mCookie = cookies.SimpleCookie(self.headers["Cookie"])
		else:
			# If there's not a cookie make an empty one and load it into a data member.
			self.mCookie = cookies.SimpleCookie()
		return

	def sendCookie(self):
		for morsel in self.mCookie.values():
			self.send_header("Set-Cookie", morsel.OutputString())
		return

	def loadSession(self):
		# Assign self.mSession according to sessionID
		self.loadCookie() # If there is a cookie we now have it in self.mCookie.
		if "sessionID" in self.mCookie:
			# Get the value of sessionID
			sessionID = self.mCookie["sessionID"].value
			self.mSession = globalSessionStore.getSession(sessionID)
			if self.mSession == None:
				# Session data does not exist for this id.
				sessionID = globalSessionStore.createSession()
				self.mSession = globalSessionStore.getSession(sessionID)
				self.mCookie["sessionID"] = sessionID
		else:
			# Client has no sessionID yet.
			sessionID = globalSessionStore.createSession()
			self.mSession = globalSessionStore.getSession(sessionID)
			self.mCookie["sessionID"] = sessionID
		# print("Current Session:", self.mSession)
		return
			
	# Handlers

	def handleLogout(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
		else:
			self.mSession.pop("userID", None)
			self.send_response(200)
			self.end_headers()

	def handleRetrieveSession(self):
		if "userID" in self.mSession:
			db = databaseHandlers.users()
			user = db.readUser(self.mSession["userID"])
			body = {
				"username": user["username"],
				"email": user["email"],
				"firstName": user["firstName"],
				"lastName": user["lastName"],
				"session": "active"
			}
			self.send_response(200)
			self.send_header("Content-type", "application/json")
			self.end_headers()
			self.wfile.write(bytes(json.dumps(body), "utf-8"))
		else:
			self.handle401()

	def handleCreateSession(self):
		length = self.headers["Content-length"]
		body = self.rfile.read(int(length)).decode("utf-8")
		data = parse_qs(body)

		if (("username" not in data) or ("password" not in data)):
			self.handleValidationError()
			return

		username = data["username"][0]
		password = data["password"][0]

		db = databaseHandlers.users()
		user = db.getUserByUsername(username)

		if user == None:
			self.handle401()
		elif bcrypt.checkpw(bytes(password, "utf-8"), user["hashedPassword"]):
			# worked
			self.mSession["userID"] = user["id"]
			self.send_response(201)
			self.end_headers()
		else:
			# incorrect password
			self.handle401()

	def handleCreateUser(self):
		users = databaseHandlers.users()
		length = self.headers["Content-length"]
		body = self.rfile.read(int(length)).decode("utf-8")
		data = parse_qs(body)

		if (("username" not in data) or ("email" not in data) or ("password" not in data) or
			("firstName" not in data) or ("lastName" not in data)):
			self.handleValidationError()
			return

		hashedPassword = bcrypt.hashpw(bytes(data["password"][0], "utf-8"), bcrypt.gensalt())

		if (users.createUser(data["username"][0], data["email"][0], hashedPassword, data["firstName"][0], data["lastName"][0])):
			self.send_response(201)
			try:
				self.end_headers()

			except BrokenPipeError:
				self.finish()
			return
		else:
			self.handleValidationError()

	def handleDeleteUsers(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		users = databaseHandlers.users()
		users.deleteUsers()
		self.send_response(200)
		try:
			self.end_headers()

		except BrokenPipeError:
			self.finish()
		return

	# new stuff end

	def handleDeleteEnemyList(self):
		# add this everywhere
		if "userID" not in self.mSession:
			self.handle401()
			return

		enemyLists = databaseHandlers.enemyLists()
		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data = splitPath[2]

		if (enemyLists.deleteEnemyList(data)):
			self.send_response(200)
			try:
				self.end_headers()

			except BrokenPipeError:
				self.finish()
		else:
			self.handleNotFound()
		return

	def handleDeleteBulletList(self):
		if "userID" not in self.mSession:
			self.handle401()
			return

		bulletLists = databaseHandlers.bulletLists()
		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data = splitPath[2]

		if (bulletLists.deleteBulletList(data)):
			self.send_response(200)
			try:
				self.end_headers()

			except BrokenPipeError:
				self.finish()
		else:
			self.handleNotFound()
		return

	def handleDeleteHighscore(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		highscores = databaseHandlers.highscores()
		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data = splitPath[2]

		if (highscores.deleteHighscore(data)):
			self.send_response(200)
			try:
				self.end_headers()

			except BrokenPipeError:
				self.finish()
		else:
			self.handleNotFound()

	def handleDeletePlayer(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		players = databaseHandlers.players()
		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data = splitPath[2]

		if (players.deletePlayer(data)):
			self.send_response(200)
			try:
				self.end_headers()

			except BrokenPipeError:
				self.finish()
		else:
			self.handleNotFound()
		return

	def handleDeleteEnemyLists(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		enemyLists = databaseHandlers.enemyLists()
		enemyLists.deleteEnemyLists()
		self.send_response(200)
		try:
			self.end_headers()

		except BrokenPipeError:
			self.finish()
		return

	def handleDeleteBulletLists(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		bulletLists = databaseHandlers.bulletLists()
		bulletLists.deleteBulletLists()
		self.send_response(200)
		try:
			self.end_headers()

		except BrokenPipeError:
			self.finish()
		return

	def handleDeleteHighscores(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		highscores = databaseHandlers.highscores()
		highscores.deleteHighscores()
		self.send_response(200)
		try:
			self.end_headers()

		except BrokenPipeError:
			self.finish()
		return

	def handleDeletePlayers(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		players = databaseHandlers.players()
		players.deletePlayers()
		self.send_response(200)
		try:
			self.end_headers()

		except BrokenPipeError:
			self.finish()
		return

	def handleUpdateEnemyList(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		enemyLists = databaseHandlers.enemyLists()
		length = self.headers["Content-length"]
		body = self.rfile.read(int(length)).decode("utf-8")
		data = parse_qs(body)

		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data["playerName"] = [splitPath[2]]

		if ("enemyList" not in data):
			self.handleBadRequest()
			return

		if enemyLists.updateEnemyList(data["playerName"][0], data["enemyList"][0]):
			self.send_response(200)
			try:
				self.end_headers()

			except BrokenPipeError:
				self.finish()
			return

		self.handleNotFound()
		return

	def handleUpdateBulletList(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		bulletLists = databaseHandlers.bulletLists()
		length = self.headers["Content-length"]
		body = self.rfile.read(int(length)).decode("utf-8")
		data = parse_qs(body)

		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data["playerName"] = [splitPath[2]]

		if ("bulletList" not in data):
			self.handleBadRequest()
			return

		if bulletLists.updateBulletList(data["playerName"][0], data["bulletList"][0]):
			self.send_response(200)
			try:
				self.end_headers()

			except BrokenPipeError:
				self.finish()
			return

		self.handleNotFound()
		return

	def handleUpdatePlayer(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		players = databaseHandlers.players()
		length = self.headers["Content-length"]
		body = self.rfile.read(int(length)).decode("utf-8")
		data = parse_qs(body)

		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data["playerName"] = [splitPath[2]]

		if (("health" not in data) and ("score" not in data) and ("wave" not in data)):
			self.handleBadRequest()
			return

		for player in players.readPlayers():
			if player["playerName"] == data["playerName"][0]:
				if data["health"]:
					players.updatePlayerHealth(data["playerName"][0], int(data["health"][0]))
				if data["score"]:
					players.updatePlayerScore(data["playerName"][0], int(data["score"][0]))
				if data["wave"]:
					players.updatePlayerWave(data["playerName"][0], int(data["wave"][0]))

				self.send_response(200)
				try:
					self.end_headers()

				except BrokenPipeError:
					self.finish()
				return
		self.handleNotFound()
		return

	def handleUpdateHighscore(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		highscores = databaseHandlers.highscores()
		length = self.headers["Content-length"]
		body = self.rfile.read(int(length)).decode("utf-8")
		data = parse_qs(body)

		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data["playerName"] = [splitPath[2]]

		if (("score" not in data) or ("wave" not in data)):
			self.handleBadRequest()
			return

		if highscores.updateHighscore(data["playerName"][0], data["score"][0], data["wave"][0]):
			self.send_response(200)
			try:
				self.end_headers()

			except BrokenPipeError:
				self.finish()
			return

		self.handleNotFound()
		return

	def handleCreateEnemyList(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		enemyLists = databaseHandlers.enemyLists()
		length = self.headers["Content-length"]
		body = self.rfile.read(int(length)).decode("utf-8")
		data = parse_qs(body)

		if (("playerName" not in data) or ("enemyList" not in data)):
			self.handleBadRequest()
			return

		enemyLists.createEnemyList(data["playerName"][0], data["enemyList"][0])
		self.send_response(201)
		try:
			self.end_headers()

		except BrokenPipeError:
			self.finish()
		return

	def handleCreateBulletList(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		bulletLists = databaseHandlers.bulletLists()
		length = self.headers["Content-length"]
		body = self.rfile.read(int(length)).decode("utf-8")
		data = parse_qs(body)

		if (("playerName" not in data) or ("bulletList" not in data)):
			self.handleBadRequest()
			return

		bulletLists.createBulletList(data["playerName"][0], data["bulletList"][0])
		self.send_response(201)
		try:
			self.end_headers()

		except BrokenPipeError:
			self.finish()

	def handleCreateHighscore(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		highscores = databaseHandlers.highscores()
		length = self.headers["Content-length"]
		body = self.rfile.read(int(length)).decode("utf-8")
		data = parse_qs(body)

		if (("playerName" not in data) or ("score" not in data) or ("wave" not in data)):
			self.handleBadRequest()
			return

		highscores.createHighscore(data["playerName"][0], int(data["score"][0]), int(data["wave"][0]))
		self.send_response(201)
		try:
			self.end_headers()

		except BrokenPipeError:
			self.finish()

	def handleCreatePlayer(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		players = databaseHandlers.players()
		length = self.headers["Content-length"]
		body = self.rfile.read(int(length)).decode("utf-8")
		data = parse_qs(body)

		if (("playerName" not in data) or ("health" not in data) or ("score" not in data) or ("wave" not in data)):
			self.handleBadRequest()
			return

		players.createPlayer(data["playerName"][0], int(data["health"][0]), int(data["score"][0]), int(data["wave"][0]))
		self.send_response(201)
		try:
			self.end_headers()

		except BrokenPipeError:
			self.finish()
		return

	def handleRetrieveEnemyList(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		enemyLists = databaseHandlers.enemyLists()
		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data = splitPath[2]

		for enemyList in enemyLists.readEnemyLists():
			if enemyList["playerName"] == data:
				self.send_response(200)
				self.send_header("Content-type", "application/json")
				try:
					self.end_headers()
					self.wfile.write(bytes(json.dumps(enemyLists.readEnemyList(data)), "utf-8"))
				except BrokenPipeError:
					self.finish()
				
				return
		self.handleNotFound()
		return

	def handleRetrieveBulletList(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		bulletLists = databaseHandlers.bulletLists()
		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data = splitPath[2]

		for bulletList in bulletLists.readBulletLists():
			if bulletList["playerName"] == data:
				self.send_response(200)
				self.send_header("Content-type", "application/json")
				try:
					self.end_headers()
					self.wfile.write(bytes(json.dumps(bulletLists.readBulletList(data)), "utf-8"))
				except BrokenPipeError:
					self.finish()
				return
		self.handleNotFound()
		return

	def handleRetrieveHighscore(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		highscores = databaseHandlers.highscores()
		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data = splitPath[2]

		
		for highscore in highscores.readHighscores():
			if highscore["playerName"] == data:
				self.send_response(200)
				self.send_header("Content-type", "application/json")
				try:
					self.end_headers()
					self.wfile.write(bytes(json.dumps(highscores.readHighscore(data)), "utf-8"))
				except BrokenPipeError:
					self.finish()
				return
		self.handleNotFound()
		return

	def handleRetrievePlayer(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		players = databaseHandlers.players()
		splitPath = self.path.split("/")
		if len(splitPath) == 2:
			self.handleNotFound()
			return
		data = splitPath[2]

		for player in players.readPlayers():
			if player["playerName"] == data:
				self.send_response(200)
				self.send_header("Content-type", "application/json")
				try:
					self.end_headers()
					self.wfile.write(bytes(json.dumps(players.readPlayer(data)), "utf-8"))
				except BrokenPipeError:
					self.finish()
				return
		self.handleNotFound()
		return

	def handleListEnemyLists(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		enemyLists = databaseHandlers.enemyLists()
		self.send_response(200)
		self.send_header("Content-type", "application/json")
		try:
			self.end_headers()
			self.wfile.write(bytes(json.dumps(enemyLists.readEnemyLists()), "utf-8"))
		except BrokenPipeError:
			self.finish()
		return

	def handleListBulletLists(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		bulletLists = databaseHandlers.bulletLists()
		self.send_response(200)
		self.send_header("Content-type", "application/json")
		try:
			self.end_headers()
			self.wfile.write(bytes(json.dumps(bulletLists.readBulletLists()), "utf-8"))
		except BrokenPipeError:
			self.finish()
		return

	def handleListHighscores(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		highscores = databaseHandlers.highscores().readHighscores()
		shakerSort.shakerSort(highscores)
		highscores = highscores[:10]

		self.send_response(200)
		self.send_header("Content-type", "application/json")
		try:
			self.end_headers()
			self.wfile.write(bytes(json.dumps(highscores), "utf-8"))
		except BrokenPipeError:
			self.finish()
		return

	def handleListPlayers(self):
		if "userID" not in self.mSession:
			self.handle401()
			return
			
		players = databaseHandlers.players()
		self.send_response(200)
		self.send_header("Content-type", "application/json")
		try:
			self.end_headers()
			self.wfile.write(bytes(json.dumps(players.readPlayers()), "utf-8"))
		except BrokenPipeError:
			self.finish()
		return

	def handleNotFound(self):
		self.send_response(404)
		self.send_header("Content-type", "text/html")
		try:
			self.end_headers()
			self.wfile.write(bytes("<h1>Error 404. Resourse not found.</h1>", "utf-8"))
		except BrokenPipeError:
			self.finish()
		return

	def handleBadRequest(self):
		self.send_response(400)
		self.send_header("Content-type", "text/html")
		try:
			self.end_headers()
			self.wfile.write(bytes("<h1>Error 400. Bad request.</h1>", "utf-8"))
		except BrokenPipeError:
			self.finish()
		return

	def handleValidationError(self):
		self.send_response(422)
		self.send_header("Content-type", "text/html")
		try:
			self.end_headers()
			self.wfile.write(bytes("<h1>Error 422. Validation Error.</h1>", "utf-8"))
		except BrokenPipeError:
			self.finish()
		return

	def handle401(self):
		self.send_response(401)
		self.send_header("Content-type", "text/html")
		try:
			self.end_headers()
			self.wfile.write(bytes("<h1>Error 401. Authentication failed.</h1>", "utf-8"))
		except BrokenPipeError:
			self.finish()
		return

class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
	pass

def serveOnPort(port):
	address = "0.0.0.0"
	httpd = ThreadingHTTPServer((address, port), Server)
	print("Server hosted on: " + address)
	print("Listening on port: " + str(port))

	httpd.serve_forever()
	return

def main():
	try:
		Thread(target=serveOnPort, args=[8080]).start()

	except KeyboardInterrupt:
		print("\nShutting down server...")
		quit()

	return

if __name__ == "__main__":
	main()