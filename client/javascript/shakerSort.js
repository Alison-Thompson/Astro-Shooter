function shakerSort(A) { // used for sorting highscores at the end of the game.
	var done = false;    // As there are only 10 a more complex algorithm is unnessisary.
	var flag = false;
	while (!done) {
		done = true;
		if (!flag) {
			for (var i = 0 ; i < A.length-1; i++) {
				if (A[i]["score"] < A[i+1]["score"]) {
					var temp = A[i]
					A[i] = A[i+1];
					A[i+1] = temp;
					done = false;
				}
			}
			flag = true;
		} else {
			for (var i = A.length-2; i > -1; i--) {
				if (A[i]["score"] < A[i+1]["score"]) {
					var temp = A[i];
					A[i] = A[i+1];
					A[i+1] = temp;
					done = false;
				}
			}
			flag = false;
		}
	}
	return A;
}