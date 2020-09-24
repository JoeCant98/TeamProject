// specialist-issues.js
// Dan Page, Tom Snelling
// modified from all-issues.js

// this file displays the issues currently assigned to a specialist on their dash page

var sorting = 'idDesc';
let loadResponse;

// sort function from all-issues.js
var sortBy = function(field, reverse, primer) {
	var key = primer ? 
		function(x) {return primer(x[field])} : 
		function(x) {return x[field]};

	reverse = !reverse ? 1 : -1;

	return function (a, b) {
		return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	} 
}

// populate function modified from all-issues.js
function populate(issuesList, sorting) {
	$('.list-group-item-action').remove();

	if (sorting == 'idDesc') {
		issuesList.sort(sortBy('id', true, parseInt));
	}
	else if (sorting == 'idAsc') {
		issuesList.sort(sortBy('id', false, parseInt));
	}
	else if (sorting == 'statusDesc') {
		issuesList.sort(sortBy('status', true, null));
	}
	else if (sorting == 'statusAsc') {
		issuesList.sort(sortBy('status', false, null));
	}

	for (i in issuesList) {
		$('#all-issues').append($('<a href="#" class="list-group-item list-group-item-action flex-column align-items-start"> \
						<div class="d-flex flex-row"> \
							<div class="p-2 col"><b>' + issuesList[i].id + '</b></div> \
							<div class="p-2 col">' + issuesList[i].timestamp + '</div> \
							<div class="p-2 col"><span id="status-' + issuesList[i].id + '">' + issuesList[i].status + '</span></div> \
							<div class="p-2 col no-overflow">' + issuesList[i].type + '</div> \
							<div class="p-2 col no-overflow">' + issuesList[i].summary + '</div> \
						</div> \
					</a>'));

		if (issuesList[i].status == 'solved') {
			$('#status-' + issuesList[i].id).addClass('green');
		}
		else if (issuesList[i].status == 'ongoing') {
			$('#status-' + issuesList[i].id).addClass('orange');
		}
		else if (issuesList[i].status == 'pending') {
			$('#status-' + issuesList[i].id).addClass('red');
		}
	}
}

var currentUser = localStorage.getItem("username");

$(document).ready(function() {
	// determine whether specialist is available or not via userAnalytics.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/userAnalytics.php', false);
	xmlHttp.send(null);	
	var specialists = JSON.parse(xmlHttp.responseText);

	var isAvailable = specialists.filter(function(x) {
		return x.specialist == currentUser;
	});

	// display this information to user
	if (isAvailable[0].available == 0) {
		$('#unavailable').parent().addClass('active');
	}
	else {
		$('#available').parent().addClass('active');
	}

	// load all issues assigned to current specilaist via specialistLoad.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/specialistLoad.php?username=' + currentUser, false);
	xmlHttp.send(null);
	loadResponse = JSON.parse(xmlHttp.responseText);

	fuse = new Fuse(loadResponse, searchOptions);
	populate(loadResponse, sorting);

	$('#userNameField').html('<p class="navbar-text">'+ currentUser + '</p>');
});

$(document).on('click', '.list-group-item-action', function() {
	var id = $($($(this).children()[0]).children()[0]).text();
	var getOpenIssues = JSON.parse(localStorage.getItem('openIssues'));
	var openIssues = getOpenIssues == null ? [] : getOpenIssues;

	if (openIssues.indexOf(id) == -1) {
		openIssues.push(id);
		localStorage.setItem('openIssues', JSON.stringify(openIssues));
	}

	location.href = 'ticket.html?id=' + id;
});

var searchOptions = {
	shouldSort: true,
	threshold: 0.2,
	location: 0,
	distance: 100,
	maxPatternLength: 32,
	minMatchCharLength: 1,
	keys: [
		"id",
		"status",
		"type",
		"summary"
	]
};
var fuse;

$(document).on('input', '#searchInput', function() {
	if ($(this).val() != "") {
		var result = fuse.search($(this).val());
		populate(result, sorting);
	}
	else {
		populate(loadResponse, sorting);
	}
});

$(document).on('click', '#sort-id', function() {
	$('#sort-status').removeClass().addClass('fa fa-sort sort-button');
	if (sorting == 'idDesc') {
		sorting = 'idAsc';
		$(this).removeClass().addClass('fa fa-caret-up sort-button');
	}
	else {
		sorting = 'idDesc';
		$(this).removeClass().addClass('fa fa-caret-down sort-button');
	}
	populate(loadResponse, sorting);
});
$(document).on('click', '#sort-status', function() {
	$('#sort-id').removeClass().addClass('fa fa-sort sort-button');
	if (sorting == 'statusDesc') {
		sorting = 'statusAsc';
		$(this).removeClass().addClass('fa fa-caret-up sort-button');
	}
	else {
		sorting = 'statusDesc';
		$(this).removeClass().addClass('fa fa-caret-down sort-button');
	}
	populate(loadResponse, sorting);
});

// when the specialist changes their availability, update the database accordingly
// via setAvailability.php
$(document).on('change', "input[name='set-availability']", function() {
	if ($(this).attr('id') == 'available') {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", '/php/setAvailability.php?specialist=' + currentUser + '&availability=1', false); 
		xmlHttp.send(null);
	}
	else if ($(this).attr('id') == 'unavailable') {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", '/php/setAvailability.php?specialist=' + currentUser + '&availability=0', false); 
		xmlHttp.send(null);
	}
});