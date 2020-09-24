// all-issues.js
// Tom Snelling | Adam Morley

// this file is used on the main screen where operators view tickets
// it loads all of the tickets from the database and displays them in a list

var sorting = 'idDesc';
let loadResponse;

// function to sort by different parameters
var sortBy = function(field, reverse, primer) {
	var key = primer ? 
		function(x) {return primer(x[field])} : 
		function(x) {return x[field]};

	reverse = !reverse ? 1 : -1;

	return function (a, b) {
		return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	} 
}

// this function populates the ticket list
// used when loading, searching and sorting tickets
function populate(issuesList, sorting) {
	// remove contents of list
	$('.list-group-item-action').remove();

	// sort list depending on desired order
	// ID ascending/descending or status ascending/descending
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

	// add each ticket to the list
	for (i in issuesList) {
		$('#all-issues').append($('<a href="#" class="list-group-item list-group-item-action flex-column align-items-start"> \
						<div class="d-flex flex-row"> \
							<div class="p-2 col no-overflow"><b>' + issuesList[i].id + '</b></div> \
							<div class="p-2 col no-overflow">' + issuesList[i].timestamp + '</div> \
							<div class="p-2 col no-overflow"><span id="status-' + issuesList[i].id + '">' + issuesList[i].status + '</span></div> \
							<div class="p-2 col no-overflow">' + issuesList[i].type + '</div> \
							<div class="p-2 col no-overflow">' + issuesList[i].summary + '</div> \
						</div> \
					</a>'));


		// colour code ticket statuses
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

// on document ready, fetch all of the tickets from the database via loadTickets.php
$(document).ready(function() {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/loadTickets.php', false);
	xmlHttp.send(null);
	loadResponse = JSON.parse(xmlHttp.responseText);

	fuse = new Fuse(loadResponse, searchOptions);

	populate(loadResponse, sorting);
});


// when a ticket is clicked on, redirect the user to the view ticket page,
// passing the ticket ID as a get parameter
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

// fuse.js options for ticket search
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

// when the search box is typed in, perform the search and repopulate the list with results
$(document).on('input', '#searchInput', function() {
	if ($(this).val() != "") {
		var result = fuse.search($(this).val());
		populate(result, sorting);
	}
	else {
		populate(loadResponse, sorting);
	}
});

// when the sort icons are clicked, change the sorting order respectively
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


// allow the user to switch between all, archived and non-archived tickets
$(document).on('change', "input[name='ticket-type']", function() {
	if ($(this).attr('id') == 'tickets-current') {
		var currentTickets = loadResponse.filter(function(x) {
			return x.isArchived == 0;
		});
		populate(currentTickets, sorting);
	}
	else if ($(this).attr('id') == 'tickets-archive') {
		var archiveTickets = loadResponse.filter(function(x) {
			return x.isArchived == 1;
		});
		populate(archiveTickets, sorting);
	}
	else {
		populate(loadResponse, sorting);
	}
});