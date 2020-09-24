//view-analytics.js
//Adam Morley | Tom Snelling
//this file is used to display data about the system on the analytics page
//it loads the data from a php file and sets the html elements to the correct value
//on document ready
$(document).ready(function() {
	//load system data via analytics.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/analytics.php', false);
	xmlHttp.send(null);
	var loadedanalytics = JSON.parse(xmlHttp.responseText);
	
	//set html element to correct value based on id
	$('#totalOpenTickets').text(loadedanalytics.totalopen);
	$('#totalClosedTickets').text(loadedanalytics.totalclosed);
	$('#totalSpecialists').text(loadedanalytics.totalspecialists);
	$('#averageTime').text(loadedanalytics.avg);
	$('#availability').text(loadedanalytics.availablepercent + '%');
	$('#totalTags').text(loadedanalytics.totaltags);
	
	//calculate correct value of bars for each element as percentage and set value
	$('#totalPending').text(Math.round((loadedanalytics.totalpending / loadedanalytics.totalnotarchived) * 100) + '%');
	$('#totalOngoing').text(Math.round((loadedanalytics.totalongoing / loadedanalytics.totalnotarchived) * 100) + '%');
	$('#totalSolved').text(Math.round((loadedanalytics.totalsolved / loadedanalytics.totalnotarchived) * 100) + '%');
	$('#solvedOperator').text(Math.round((loadedanalytics.operatorsolve / loadedanalytics.totalresolved) * 100) + '%');
	$('#solvedSpecialist').text(Math.round((loadedanalytics.specialistsolve / loadedanalytics.totalresolved) * 100) + '%');
	$('#hardwarePercent').text(Math.round((loadedanalytics.totalhardware / loadedanalytics.total) * 100) + '%');
	$('#softwarePercent').text(Math.round((100 - (loadedanalytics.totalhardware / loadedanalytics.total) * 100)) + '%');

	//calculate correct width of bars for each element as percentage and set value
	$('#bar-pending').css('width', (loadedanalytics.totalpending / loadedanalytics.totalnotarchived) * 100 + '%');
	$('#bar-ongoing').css('width', (loadedanalytics.totalongoing / loadedanalytics.totalnotarchived) * 100 + '%');
	$('#bar-solved').css('width', (loadedanalytics.totalsolved / loadedanalytics.totalnotarchived) * 100 + '%');
	$('#bar-operator').css('width', (loadedanalytics.operatorsolve / loadedanalytics.totalresolved) * 100 + '%');
	$('#bar-specialist').css('width', (loadedanalytics.specialistsolve / loadedanalytics.totalresolved) * 100 + '%');
	$('#bar-hardware').css('width', (loadedanalytics.totalhardware / loadedanalytics.total) * 100 + '%');
	$('#bar-software').css('width', (100 - (loadedanalytics.totalhardware / loadedanalytics.total) * 100) + '%');

	//load tags from topTags.php
	xmlHttp.open("GET", '/php/topTags.php', false);
	xmlHttp.send(null);
	var loadedtags = JSON.parse(xmlHttp.responseText);
	
	//simplified loop to populate table modified from specialist-analytics.js
	for (i in loadedtags) {
		$('#top-tags').append($('<a href="#" class="list-group-item list-group-item-action flex-column align-items-start"> \
			<div class="d-flex flex-row"> \
				<div class="p-2 col"><b>' + loadedtags[i].tag + '</b></div> \
				<div class="p-2 col">' + loadedtags[i].count + '</div> \
				<div class="p-2 col no-overflow">' + Math.round((loadedtags[i].count / loadedanalytics.total) * 100) + '%</div> \
			</div> \
		</a>'));
	}
});
