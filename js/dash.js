// dash.js
// Tom Snelling

// this file is used on dash.html to show any currently open tickets

$(document).ready(function() {
	var getOpenIssues = JSON.parse(localStorage.getItem('openIssues'));
	var openIssues = getOpenIssues == null ? [] : getOpenIssues;

	// if there are any currently open tickets, append them to the page for quick access
	if (openIssues.length > 0) {
		$('#open-issues').append($('<h4>Tickets open in this session:</h4><br>'));

		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", '/php/loadTickets.php', false);
		xmlHttp.send(null);
		issues = JSON.parse(xmlHttp.responseText);

		for (i in openIssues) {
			var thisIssue = issues.filter(function( obj ) {
				return obj.id == openIssues[i];
			});
			$('#open-issues').append($('<div class="card mb-3 w-100"> \
  											<div class="card-header list-heading"> \
  												<a href="ticket.html?id=' + thisIssue[0].id + '" class="btn btn-primary btn-grow">#' + thisIssue[0].id + '&nbsp; <i class="fa fa-arrow-right"></i></a> \
  											</div> \
											<div class="card-body"> \
												<h4 class="card-title">' + thisIssue[0].summary + '</h4> \
												<p class="card-text">' + thisIssue[0].timestamp + ' &mdash; ' + thisIssue[0].status + '</p> \
											</div> \
										</div>'));
		}
	}
	// if not, let the user know
	else {
		$('#open-issues').append($('<h4>There are no tickets open in this session.</h4>'));
	}
});