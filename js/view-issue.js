// view-issue.js
// Tom Snelling | Adam Morley

// this issue is used to view a single ticket and make any changes to it

// function to get get parameters from a URL
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let loadedIssue;
let archived = 0;

// on document ready
$(document).ready(function() {
	// get info on a single ticket via loadOneTicket.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/loadOneTicket.php?id=' + getParameterByName('id'), false);
	xmlHttp.send(null);
	loadedIssue = JSON.parse(xmlHttp.responseText);

	// load problem types from database via loadProblemTypes.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/loadProblemTypes.php', false);
	xmlHttp.send(null);
	var loadedProblemTypes = JSON.parse(xmlHttp.responseText);

	// display all problem types in a dropdown with 3 levels of depth
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

	// load all operators from db via getUsers.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/getUsers.php?type=Operator', false);
	xmlHttp.send(null);
	var loadedUsers = JSON.parse(xmlHttp.responseText);

	// add all operators to 'solved by' dropdown
	for (i in loadedUsers) {
		$('#solved-by').append($('<option value="' + loadedUsers[i].user + '">' + loadedUsers[i].name + '</option>'));
	}

	//load all specialists from db via getUsers.php
	xmlHttp.open("GET", '/php/getUsers.php?type=Specialist', false);
	xmlHttp.send(null);
	var loadedSpecialists = JSON.parse(xmlHttp.responseText);

	//add all specialists to 'solved by' dropdown
	for (i in loadedSpecialists) {
		$('#solved-by').append($('<option value="' + loadedSpecialists[i].user + '">' + loadedSpecialists[i].name + '</option>'));
	}

	setTimeout(function() {
		var id = '#issue-link-' + getParameterByName('id');
		$(id).addClass('active');
	}, 20);

	// load all of the information we fetched from the database into 
	// the respective fields on the page

	$('#solved-by').val(localStorage.getItem('username'));

	$('#problemId').text(loadedIssue.id);
	$("#status").text(loadedIssue.status);
	$('#createdAt').text(loadedIssue.timestamp);
	$('#createdBy').text(loadedIssue.operator);

	if (loadedIssue.followup != -1) {
		$('#followupOf').html('<a href="ticket.html?id=' + loadedIssue.followup + '">#' + loadedIssue.followup + '</a>');
	}
	else {
		$('#followupOf').text('Not a follow-up');
	}

	// load the tags for this issue via getTags.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/getTags.php?id=' + loadedIssue.id, false);
	xmlHttp.send(null);
	var loadedTags = JSON.parse(xmlHttp.responseText);

	// and display them on the page
	var tags = loadedTags.tags;
	for (i in tags) {
		$('.tags').append($('<span class="badge badge-secondary">' + tags[i] + '</span>'));
	}

	$('#callerName').val(loadedIssue.firstName + ' ' + loadedIssue.lastName);
	$("#callerEmail").val(loadedIssue.email);
	$('#problem-type').val(loadedIssue.problemtype);
	$("#assignedSpecialist").val(loadedIssue.specialist);

	$('#problemClassification').val(loadedIssue.type);

	$('#serialNumber').val(loadedIssue.hwserial);
	$('#operatingSystem').val(loadedIssue.osname);
	$('#softwareName').val(loadedIssue.swname);
	$('#softwareVersion').val(loadedIssue.swversion);
	$('#softwareLicense').val(loadedIssue.swlicense);

	if (loadedIssue.type == 'Hardware') {
		$('#hwserial-group').show();
	}
	else if (loadedIssue.type == 'Software') {
		$('#osname-group').show();
		$('#swinfo-group').show();
	}

	$('#problemSummary').val(loadedIssue.summary);
	$('#problemDetail').val(loadedIssue.details);

	$('#solvedBy').text(loadedIssue.solvedBy);
	$('#solvedAt').text(loadedIssue.solvedAt);
	$('#resolutionDetails').val(loadedIssue.solution);

	if (loadedIssue.status == 'solved') {
		$('#status').addClass('green');
		$('#button-resolved').hide();
		$('#solution-group').show();
	}
	else if (loadedIssue.status == 'ongoing') {
		$('#status').addClass('orange');
		$('#button-ongoing').hide();
	}
	else if (loadedIssue.status == 'pending') {
		$('#status').addClass('red');
	}
	
	if (loadedIssue.isArchived == 1) {
		$("#button-edit").hide();
		$("#button-archive").text('Unarchive ticket');
		$("#button-resolved").hide();
		
	}
});

// when the user clicks edit button
$(document).on('click', '#button-edit', function() {
	// enable all the fields
	$('input[type="text"], textarea, select').each(function(i, el) {
		$(el).prop('disabled', function(i, v) { return !v; });
	});
	
	$("#button-archive").hide();
	$("#button-cancel").show();	

	if ($("#button-edit").text() == 'Edit this ticket') {
		$("#button-edit").text('Save changes');
		$("#button-delete").show();
	}
	else {
		// save changed made 
		$("#button-edit").text('Edit this ticket');
		$("#button-delete").hide();
		saveChanges();
	}
});

// mark the ticket as ongoing when user click ongoing button
$(document).on('click', "#button-ongoing", function() {
	$('#status').text('ongoing');
	saveChanges();
	$("#button-ongoing").hide();
	location.reload();
});

// button to cancel without making any changes
$(document).on('click', "#button-cancel", function() {
	location.reload();
});

// when user resolves the ticket
$(document).on('click', '#save-resolution', function() {
	// check for empty fields
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

	// if none, save the ticket resolution via createResolution.php
	if (count == 0) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", '/php/createResolution.php?id=' + loadedIssue.id + '&operator=' + $('#solved-by').val() + '&resolutionDetail=' + $('#resolution-detail').val(), false); // false for synchronous request
		xmlHttp.send(null);
		location.reload();
	}
});

// function to save changes
function saveChanges() {
	// build the GET string
	var getString = '?id=' + loadedIssue.id + '&status=' + $('#status').text() + '&firstname=' + $('#callerName').val().split(' ')[0] + '&lastname=' + $('#callerName').val().split(' ')[1] + '&email=' + $('#callerEmail').val() + '&specialist=' + $('#assignedSpecialist').val() + '&type=' + $('#problemClassification').val() + '&problemtype=' + $('#problem-type').val() + '&summary=' + $('#problemSummary').val() + '&details=' + $('#problemDetail').val() + '&hwserial=' + $('#serialNumber').val() + '&osname=' + $('#operatingSystem').val() + '&swname=' + $('#softwareName').val() + '&swversion=' + $('#softwareVersion').val() + '&swlicense=' + $('#softwareLicense').val() + '&archived=' + archived;
	
	// update the ticket entry in the database via update.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/update.php' + getString, false);
	xmlHttp.send(null);
	location.reload();
}

// when user clicks confirm delete button
$(document).on('click', '#confirm-delete', function() {
	// delete the ticket from the database via deleteTicket.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/deleteTicket.php?id=' + loadedIssue.id, false);
	xmlHttp.send(null);
	location.href = 'all.html';
});

// either archive or un-archive a ticket based on what the user clicks
$(document).on('click', '#button-archive', function() {
	if ($("#button-archive").text() == 'Archive ticket') {
		archived = 1;
		saveChanges();
		$("#button-edit").hide();
		archived = 0;
		$("#button-archive").text('Unarchive ticket');
	}
	else if ($("#button-archive").text() == 'Unarchive ticket') {
		archived = 0;
		saveChanges();
		$("#button-edit").show();
		$("#button-archive").text('Archive ticket');
	}	
});