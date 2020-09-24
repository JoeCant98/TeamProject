// specialist-analytics.js
// Adam Morley

// this file is used to display information about the specialists on the analytics page

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
function populate(analytics, sorting){
	$('.list-group-item-action').remove();

	if (sorting == 'openDesc') {
		analytics.sort(sortBy('opentickets', true, parseInt));
	}
	else if (sorting == 'openAsc') {
		analytics.sort(sortBy('opentickets', false, parseInt));
	}
	else if (sorting == 'closedDesc') {
		analytics.sort(sortBy('closedtickets', true, null));
	}
	else if (sorting == 'closedAsc') {
		analytics.sort(sortBy('closedtickets', false, null));
	}
	for (i in analytics) {
		$('#all-issues').append($('<a href="#" class="list-group-item list-group-item-action flex-column align-items-start"> \
			<div class="d-flex flex-row"> \
				<div class="p-2 col"><b>' + analytics[i].name + '</b></div> \
				<div class="p-2 col">' + analytics[i].opentickets + '</div> \
				<div class="p-2 col no-overflow">' + analytics[i].closedtickets + '</div> \
			</div> \
		</a>'));
	}
}

// on document ready
$(document).ready(function() {
	// load specialist information via userAnalytics.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/userAnalytics.php', false);
	xmlHttp.send(null);
	loadResponse = JSON.parse(xmlHttp.responseText);
	
	// populate the list with this data
	populate(loadResponse, sorting);
});

// when the user clicks a sort option, change the list sorting accordingly
$(document).on('click', '#sort-open', function() {
	$('#sort-closed').removeClass().addClass('fa fa-sort sort-button');
	if (sorting == 'openDesc') {
		sorting = 'openAsc';
		$(this).removeClass().addClass('fa fa-caret-up sort-button');
	}
	else {
		sorting = 'openDesc';
		$(this).removeClass().addClass('fa fa-caret-down sort-button');
	}
	populate(loadResponse, sorting);
});
$(document).on('click', '#sort-closed', function() {
	$('#sort-open').removeClass().addClass('fa fa-sort sort-button');
	if (sorting == 'closedDesc') {
		sorting = 'closedAsc';
		$(this).removeClass().addClass('fa fa-caret-up sort-button');
	}
	else {
		sorting = 'closedDesc';
		$(this).removeClass().addClass('fa fa-caret-down sort-button');
	}
	populate(loadResponse, sorting);
});