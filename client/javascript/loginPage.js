function displayLoginPage() {
	clearPage();
	var body = document.querySelector("#body");

	var signupButton = document.createElement("button");
	var signupButtonTextNode = document.createTextNode("Sign Up");
	signupButton.setAttribute("id", "logout-button");
	signupButton.appendChild(signupButtonTextNode);
	body.appendChild(signupButton);
	signupButton.addEventListener("click", function () {
    	displaySignUpPage();
    });

	var header = document.createElement("h1");
	var headerTextNode = document.createTextNode("Please Login");
	header.setAttribute("id", "header");
	header.appendChild(headerTextNode);
	body.appendChild(header);

	var usernameEntry = document.createElement("input");
	usernameEntry.setAttribute("type", "text");
	usernameEntry.setAttribute("id", "username-field");
	usernameEntry.setAttribute("autofocus", "autofocus");
	usernameEntry.setAttribute("spellcheck", "false");
	usernameEntry.setAttribute("placeholder", "Username");
	body.appendChild(usernameEntry);

	var passwordEntry = document.createElement("input");
	passwordEntry.setAttribute("type", "password");
	passwordEntry.setAttribute("id", "password-field");
	passwordEntry.setAttribute("autofocus", "autofocus");
	passwordEntry.setAttribute("spellcheck", "false");
	passwordEntry.setAttribute("placeholder", "Password");
	body.appendChild(passwordEntry);


	usernameEntry.addEventListener('keypress', function (event) {
	    var key = event.which || event.keyCode;
	    if (key === 13) {
	      attemptLogin(header, usernameEntry, passwordEntry);
	    }
	});

	passwordEntry.addEventListener('keypress', function (event) {
	    var key = event.which || event.keyCode;
	    if (key === 13) {
	      attemptLogin(header, usernameEntry, passwordEntry);
	    }
	});
};

function attemptLogin(header, usernameEntry, passwordEntry) {
	var body = "username="+encodeURIComponent(usernameEntry.value)+
			  "&password="+encodeURIComponent(passwordEntry.value);
	server.post("/sessions", body, function(response) {
		if (response.status == 201) {
			// Login succesful.
			startup()
		} else {
			header.innerHTML = "Username or password incorrect."
		}
	});
}