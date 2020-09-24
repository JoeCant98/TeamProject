// common.js
// Tom Snelling | Adam Morley

// this file is included on most pages
// it includes some useful functions that are needed on more than one page,
// such as populating the navbar and holding the current users username

let openIssues;
let loadedUser;

// on document ready
$(document).ready(function() {
	// get the current user from localstorage
	var currentUser = localStorage.getItem('username');
	$('#current-user').text(currentUser);

	// determine whether the current user is an operator or a specialist via getUserType.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/getUserType.php?username=' + currentUser, false);
	xmlHttp.send(null);
	loadedUser = JSON.parse(xmlHttp.responseText);

	// if the user is a specialist, stop them navigating to operator-only pages
	// and show any specialist-only elements
	if (loadedUser.type == 'Specialist') {
		$('.navbar-brand').attr('href', 'specialist.html');
		$('ul.navbar-nav').children('li:not([view-as="specialist"])').remove();

		$('[view-as="specialist"]').show()
	}
	
	// if the current user is an operator, show any operator-only elements
	if (loadedUser.type == 'Operator'){
		$('[view-as="operator"]').show()
	}

	// add any currently open tickets to the navbar for quick navigation
	openIssues = JSON.parse(localStorage.getItem('openIssues'));
	for (i in openIssues) {
		$('ul.navbar-nav').append($('<li class="nav-item"><a class="nav-link issue-link" href="#" id="issue-link-' + openIssues[i] + '">#' + openIssues[i] + '</a><a class="nav-link close-issue" href="#"><i class="fa fa-times fa-small"></a></i></li>'))
	}

	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	});
});

// when a ticket in the navbar is clicked, take the user to the page for that ticket
$(document).on('click', '.issue-link', function() {
	var id = $(this).attr('id').split('-')[2];
	location.href = 'ticket.html?id=' + id;
});

// when a ticket in the navbar is closed, remove it from currently open tickets
// and redirect the user accordingly
$(document).on('click', '.close-issue', function() {
	var id = $($(this).siblings()[0]).attr('id').split('-')[2];
	var index = openIssues.indexOf(id);
	openIssues.splice(index, 1);
	localStorage.setItem('openIssues', JSON.stringify(openIssues));
	
	if (location.href.indexOf('ticket.html') != -1) {
		if (loadedUser.type == 'Operator') {
			location.href = 'all.html';
		}
		else if (loadedUser.type == 'Specialist') {
			location.href = 'specialist.html';
		}
	}
	else {
		location.reload();
	}
});