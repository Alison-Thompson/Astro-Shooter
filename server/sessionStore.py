import base64
import os

class SessionStore:

	def __init__(self): # remove userID when they logout.
		self.mSessions = {}
		return

	def generateSessionID(self):
		# Maybe just find a uuid generator or just use this.
		# It's very good random. Takes white noise from the
		# system. Very close to true random.
		rnum = os.urandom(32)
		rstring = base64.b64encode(rnum).decode("utf-8")
		return rstring

	def createSession(self):
		# Put default stuff in here.
		sessionID = self.generateSessionID()
		self.mSessions[sessionID] = {}
		return sessionID

	def getSession(self, sessionID): # Don't need to have an update because it's passed by reference.
		if sessionID in self.mSessions:
			# Return existing session by id.
			return self.mSessions[sessionID]
		else:
			# Return nothing if id is invalid.
			return None