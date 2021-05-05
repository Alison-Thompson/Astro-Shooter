def shakerSort(A): # for sorting highscores
	done = False
	flag = 0
	while not done:
		done = True
		if not flag:
			for i in range(0, len(A)-1):
				if A[i]["score"] < A[i+1]["score"]:
					A[i], A[i+1] = A[i+1], A[i]
					done = False
			flag = 1
		else:
			for i in range(len(A)-2, -1, -1):
				if A[i]["score"] < A[i+1]["score"]:
						A[i], A[i+1] = A[i+1], A[i]
						done = False
			flag = 0
	return A