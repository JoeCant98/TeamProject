// problem-types.js
// Tom Snelling

// this file is used to load and create problem types

$(document).ready(function() {
	// get all problem types from the database via loadProblemTypes.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/loadProblemTypes.php', false);
	xmlHttp.send(null);
	var loadedProblemTypes = JSON.parse(xmlHttp.responseText);

	// populate the problem types dropdown with 3 levels of depth
	var level_0 = loadedProblemTypes.filter(function(x) {
		return x.subtype_of == -1;
	});

	for (i in level_0) {
		$('#subtype-of').append($('<option value="' + level_0[i].id + '">' + level_0[i].description + '</option>'));

		level_1 = loadedProblemTypes.filter(function(x) {
			return x.subtype_of == level_0[i].id;
		});

		for (j in level_1) {
			$('#subtype-of').append($('<option value="' + level_1[j].id + '">&mdash; ' + level_1[j].description + '</option>'));

			level_2 = loadedProblemTypes.filter(function(x) {
				return x.subtype_of == level_1[j].id;
			});

			for (k in level_2) {
				$('#subtype-of').append($('<option value="' + level_2[k].id + '">&mdash;&mdash; ' + level_2[k].description + '</option>'));
			}
		}
	}
});

// on create button clicked
$(document).on('click', '#create-problem-type', function() {
	// add a new problem type to the database via createProblemType.php
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", '/php/createProblemType.php?description=' + $('#description').val() + '&subtypeof=' + $('#subtype-of').val(), false);
	xmlHttp.send(null);
	location.reload();
});