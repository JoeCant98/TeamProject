// create-issue.js
// Tom Snelling, Adam Morley

// this file is used to create a new ticket, used in new.html

var ticketType = 'Hardware';
var summaryEl = $('#hw-problem-summary');
var detailsEl = $('#hw-problem-details');

// on document ready
$(document).ready(function() {
	// set the 'created by' field to the current user
	$('#created-by').text(localStorage.getItem('username'));

	// get users from db via userAnalytics.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/userAnalytics.php', false);
	xmlHttp.send(null);	
	var specialists = JSON.parse(xmlHttp.responseText);
	console.log(specialists)

	// for each specialist, if they are available, add them to the list of specialists 
	// alongside the current number of open tickets assigned to them
	for (i in specialists) {
		if (specialists[i].available == 1) {
			$('#assign-specialist').append($('<option value="' + specialists[i].specialist + '">(' + specialists[i].opentickets + ') ' + specialists[i].name + '</option>'));
		}
	}

	// also add an operator option 
	$('#assign-specialist').append($('<option value="Operator">Current operator</option>'));

	// load problem types from the databse via loadProblemTypes.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/loadProblemTypes.php', false);
	xmlHttp.send(null);
	var loadedProblemTypes = JSON.parse(xmlHttp.responseText);

	// populate the problem types list with 3 levels of depth
	var level_0 = loadedProblemTypes.filter(function(x) {
		return x.subtype_of == -1;
	});

	for (i in level_0) {
		$('#problem-type').append($('<option value="' + level_0[i].id + '">' + level_0[i].description + '</option>'));

		level_1 = loadedProblemTypes.filter(function(x) {
			return x.subtype_of == level_0[i].id;
		});

		for (j in level_1) {
			$('#problem-type').append($('<option value="' + level_1[j].id + '">&mdash; ' + level_1[j].description + '</option>'));

			level_2 = loadedProblemTypes.filter(function(x) {
				return x.subtype_of == level_1[j].id;
			});

			for (k in level_2) {
				$('#problem-type').append($('<option value="' + level_2[k].id + '">&mdash;&mdash; ' + level_2[k].description + '</option>'));
			}
		}
	}
});

// set the type of ticket to Hardware/Software depending on what the operator chooses
$(document).on('click', '#pills-hw-tab', function() {
	ticketType = 'Hardware';
});
$(document).on('click', '#pills-sw-tab', function() {
	ticketType = 'Software';
});

// when the create button is clicked
$(document).on('click', '#button-create', function() {
	// get the follow-up ID if there is one
	var followupId;
	var status = 'pending';
	if ($('#followup-id').val().length > 0) {
		followupId = $('#followup-id').val();
	}
	else {
		followupId = -1;
	}

	// choose whether to use hardware or software details
	if (ticketType == 'Hardware') {
		summaryEl = $('#hw-problem-summary');
		detailsEl = $('#hw-problem-details');
	}
	else if (ticketType == 'Software') {
		summaryEl = $('#sw-problem-summary');
		detailsEl = $('#sw-problem-details');
	}
	
	// if the operator was assigned, mark the ticket ongoing
	if ($('#assign-specialist').val() == 'Operator') {
		status = 'ongoing';
	}

	// build the GET string with all of the information
	var getString = '?firstname=' + $('#callerName').val().split(' ')[0] + '&lastname=' + $('#callerName').val().split(' ')[1] + '&email=' + $('#staffEmail').val() + '&specialist=' + $('#assign-specialist').val() + '&type=' + ticketType + '&problemtype=' + $('#problem-type').val() + '&summary=' + summaryEl.val() + '&details=' + detailsEl.val() + '&followup=' + followupId + '&operator=' + $('#created-by').text() + '&hwserial=' + $('#hardware-serial').val() + '&osname=' + $('#operatingsystem').val() + '&swname=' + $('#software-name').val() + '&swversion=' + $('#software-version').val() + '&swlicense=' + $('#software-license').val() + '&tags=' + $('#tags').val() + '&status=' + status;

	// count the number of empty fields and give them a red border so the user knows they need to be filled
	var count = 0;
	$('input, select, textarea').each(function(i, el) {
		if ($(el).val() == '' && $(el).is(':visible')) {
			count++;

			$(el).css('border', '1px solid red');
			setTimeout(function() {
				$(el).css('border', '');
			}, 2000);
		}
	});

	// if there are no empty fields, we can submit
	if (count == 0) {
		// create the new ticket in the database via create.php
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", '/php/create.php' + getString, false);
		xmlHttp.send(null);

		// everything worked, go back home
		if (xmlHttp.responseText == 'OK') {
			$('#created-prompt').fadeIn(500, function() {
				location.href = 'all.html';
			});
		}
		// there was an error creating the ticket, let the user know
		else {
			$('#failed-prompt').fadeIn(500, function() {
				setTimeout(function() {
					$('#failed-prompt').fadeOut(500);
				}, 2000);
			});
		}
	}
});

// show or hide the follow-up ID entry depending on whether or not the ticket is a follow-up
$(document).on('change', "input[name='ticket-type']", function() {
	if ($(this).attr('id') == 'ticket-followup') {
		$('#followup-id').show();
	}
	else {
		$('#followup-id').hide();
	}
});