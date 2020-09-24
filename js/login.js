// login.js
// Tom Snelling

// used on the login page to authorise users

// submit on enter keypress
$(document).on('keypress', '#username, #password', function(event) {
    if (event.keyCode === 13) {
        $("#login").click();
    }
});

// on login button clicked
$(document).on('click', '#login', function() {
	var user = $('#username').val();
	var pass = $('#password').val();

	// check username and password against database via login.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/login.php?username=' + user + '&password=' + pass, false);
	xmlHttp.send(null);
	var loadedUser = JSON.parse(xmlHttp.responseText);

	// if they match, redirect the user accordingly
	if (user == loadedUser.user && user != 'root') {
		localStorage.setItem('username', user);

		// all.html if they are an operator
		if (loadedUser.type == 'Operator') {
			location.href = 'all.html';
		}
		// specialist.html if they are specialist
		else if (loadedUser.type == 'Specialist') {
			location.href = 'specialist.html';
		}
	}
	// if the credentials don't match, alert the user
	else {
		$('#error-message').text('Incorrect login!');
		$('input').css('border', '1px solid red');
		setTimeout(function() {
			$('#error-message').text('');
			$('input').css('border', '');
		}, 2000);
	}
});
