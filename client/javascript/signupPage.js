function displaySignUpPage() {
	clearPage();
	var body = document.querySelector("#body");

	var loginButton = document.createElement("button");
	var loginButtonTextNode = document.createTextNode("Sign in");
	loginButton.setAttribute("id", "logout-button");
	loginButton.appendChild(loginButtonTextNode);
	body.appendChild(loginButton);
	loginButton.addEventListener("click", function () {
    	displayLoginPage();
    });

	var header = document.createElement("h1");
	var headerTextNode = document.createTextNode("Sign Up");
	header.setAttribute("id", "header");
	header.appendChild(headerTextNode);
	body.appendChild(header);

	var firstNameEntry = document.createElement("input");
	firstNameEntry.setAttribute("type", "text");
	firstNameEntry.setAttribute("id", "firstName-field-signup");
	firstNameEntry.setAttribute("autofocus", "autofocus");
	firstNameEntry.setAttribute("spellcheck", "false");
	firstNameEntry.setAttribute("placeholder", "First Name");
	body.appendChild(firstNameEntry);


	var lastNameEntry = document.createElement("input");
	lastNameEntry.setAttribute("type", "text");
	lastNameEntry.setAttribute("id", "lastName-field-signup");
	lastNameEntry.setAttribute("autofocus", "autofocus");
	lastNameEntry.setAttribute("spellcheck", "false");
	lastNameEntry.setAttribute("placeholder", "Last Name");
	body.appendChild(lastNameEntry);

	var emailEntry = document.createElement("input");
	emailEntry.setAttribute("type", "text");
	emailEntry.setAttribute("id", "email-field-signup");
	emailEntry.setAttribute("autofocus", "autofocus");
	emailEntry.setAttribute("spellcheck", "false");
	emailEntry.setAttribute("placeholder", "Email");
	body.appendChild(emailEntry);

	var usernameEntry = document.createElement("input");
	usernameEntry.setAttribute("type", "text");
	usernameEntry.setAttribute("id", "username-field-signup");
	usernameEntry.setAttribute("autofocus", "autofocus");
	usernameEntry.setAttribute("spellcheck", "false");
	usernameEntry.setAttribute("placeholder", "Username");
	body.appendChild(usernameEntry);

	var passwordEntry = document.createElement("input");
	passwordEntry.setAttribute("type", "password");
	passwordEntry.setAttribute("id", "password-field-signup");
	passwordEntry.setAttribute("autofocus", "autofocus");
	passwordEntry.setAttribute("spellcheck", "false");
	passwordEntry.setAttribute("placeholder", "Password");
	body.appendChild(passwordEntry);


	usernameEntry.addEventListener('keypress', function (event) {
	    var key = event.which || event.keyCode;
	    if (key === 13) {
	      attemptSignUp(header, usernameEntry, emailEntry, passwordEntry, firstNameEntry, lastNameEntry);
	    }
	});

	emailEntry.addEventListener('keypress', function (event) {
	    var key = event.which || event.keyCode;
	    if (key === 13) {
	      attemptSignUp(header, usernameEntry, emailEntry, passwordEntry, firstNameEntry, lastNameEntry);
	    }
	});

	passwordEntry.addEventListener('keypress', function (event) {
	    var key = event.which || event.keyCode;
	    if (key === 13) {
	      attemptSignUp(header, usernameEntry, emailEntry, passwordEntry, firstNameEntry, lastNameEntry);
	    }
	});
	firstNameEntry.addEventListener('keypress', function (event) {
	    var key = event.which || event.keyCode;
	    if (key === 13) {
	      attemptSignUp(header, usernameEntry, emailEntry, passwordEntry, firstNameEntry, lastNameEntry);
	    }
	});
	lastNameEntry.addEventListener('keypress', function (event) {
	    var key = event.which || event.keyCode;
	    if (key === 13) {
	      attemptSignUp(header, usernameEntry, emailEntry, passwordEntry, firstNameEntry, lastNameEntry);
	    }
	});
};

function attemptSignUp(header, usernameEntry, emailEntry, passwordEntry, firstNameEntry, lastNameEntry) {
	var body = "username=" +encodeURIComponent(usernameEntry.value)+
			  "&password=" +encodeURIComponent(passwordEntry.value)+
			  "&email="    +encodeURIComponent(emailEntry.value)+
			  "&firstName="+encodeURIComponent(firstNameEntry.value)+
			  "&lastName=" +encodeURIComponent(lastNameEntry.value);
	var sessionBody = "username="+encodeURIComponent(usernameEntry.value)+
			  		 "&password="+encodeURIComponent(passwordEntry.value);

	server.post("/users", body, function(response) {
		if (response.status == 201) {
			// signup succesful.
			server.post("/sessions", sessionBody, function (respsonse) {
				if (respsonse.status == 201) {
					// login successful.
					startup();
				} else {
					header.innerHTML = "Failed to login. Please try again later."
				}
			});
		} else {
			header.innerHTML = "Username or Email already taken.";
		}
	});
};