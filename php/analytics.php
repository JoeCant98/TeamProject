<?php
//analytics.php
//Adam Morley

//this file accesses the database with multiple SQL queries to obtain data used on the analytics page
//various datasets from different tables are loaded and manipulated here
//it outputs the results in an array
//this file is called from view-analytics.js
	//error checking
	ini_set('display_errors', 1);	
	ini_set('display_startup_errors', 1);
	error_reporting(0);

	//database connection
	require_once 'MDB2.php';
	$user = "root";
	$pass = "teamproject";
	$host = "localhost";
	$db_name = "helpdesk";

	$conn = "mysql://$user:$pass@$host/$db_name";
	$db =& MDB2::connect($conn);

	if (PEAR::isError($db)) { 
		die($db->getMessage());
	}

	$table = "Tickets";
	
	//SQL query to gather various data from various tables, each given appropriate names for their row
	$sql = "SELECT (SELECT COUNT(*) FROM $table WHERE status='pending' OR status='ongoing') AS 'tot_open', (SELECT COUNT(*) FROM $table WHERE status='solved') AS 'tot_closed', (SELECT COUNT( * ) FROM Specialists) AS  'tot_specialists', (SELECT COUNT(*) FROM $table WHERE type = 'Hardware') AS 'tot_hardware', (SELECT COUNT(*) FROM $table WHERE type = 'Software') AS 'tot_software', (SELECT COUNT(*) FROM $table WHERE status = 'pending' AND archived ='0') AS 'tot_pending', (SELECT COUNT(*) FROM $table WHERE status = 'ongoing' AND archived = '0') AS 'tot_ongoing', (SELECT COUNT(*) FROM $table WHERE status = 'solved' AND archived = '0') AS 'tot_solved', (SELECT COUNT(*) FROM Users WHERE type = 'Specialist' AND available = '0') AS 'tot_unavailable', (SELECT COUNT(*) FROM Tags) AS 'tot_tags', (SELECT COUNT(*) FROM Tickets WHERE archived = '0') AS tot_notarchived";

	//query database
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}
	
	while ($row = $res->fetchRow()) {
		//store query results in appropriate variables
		$totalopen = $row[0];
		$totalclosed = $row[1];
		$totalspecialists = $row[2];
		$totalhardware = $row[3];
		$totalsoftware = $row[4];
		$totalpending = $row[5];
		$totalongoing = $row[6];
		$totalsolved = $row[7];
		$totalunavailable = $row[8];
		$totaltags = $row[9];
		$totalnotarchived = $row[10];
	}

	//SQL query to gather various data from various tables
	$sql = "SELECT Resolvedtickets.timestamp, Tickets.timestamp, Tickets.id FROM Resolvedtickets JOIN Tickets WHERE Resolvedtickets.id = Tickets.id";

	//query database
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

	while ($row = $res->fetchRow()) {
		//store query results in appropriate variables
		$resolvedtime = strtotime($row[0]);
		$createdtime = strtotime($row[1]);
		$id = $row[2];
		$time = $resolvedtime - $createdtime;
		$avgtime = $avgtime + $time;
		$avgcount = $avgcount + 1;
	}

	//SQL query to gather various data from various tables
	$sql = "SELECT (SELECT COUNT(*) FROM Resolvedtickets JOIN Users WHERE Resolvedtickets.solvedby = Users.username AND Users.type = 'Specialist' GROUP BY Users.type) AS specialistsolve, (SELECT COUNT(*) FROM Resolvedtickets JOIN Users WHERE Resolvedtickets.solvedby = Users.username AND Users.type = 'Operator' GROUP BY Users.type) AS operatorsolve";
	
	//query database
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

	while ($row = $res->fetchRow()) {
		//store query results in appropriate variables
		$specialistsolve = $row[0];
		$operatorsolve = $row[1];
		//if no result set to 0
		if ($specialistsolve == null) {
			$specialistsolve = 0;
		}
		if ($operatorsolve == null) {
			$operatorsolve = 0;
		}
	}

	//data manipulation
	$total = $totalopen + $totalclosed;
	$softwarepercent = round(($totalsoftware / $total) * 100);

	$totalavailable = $totalspecialists - $totalunavailable;
	$availablepercent = round(($totalavailable / $totalspecialists) * 100);

	$totalresolved = $specialistsolve + $operatorsolve;
	
	//convert average time in seconds to hours and minutes
	$avg = $avgtime / $avgcount;
	$avghour = floor($avg / 3600);
	$avgmin = round(($avg - ($avghour * 3600)) / 60);
	if ($avgmin < 10){
		$avgmin = '0' . $avgmin;
	}
	$displayavg = $avghour . 'h' . $avgmin . 'm';
	
	//echo results
	echo json_encode(array("total"=>$total, "totalopen"=>$totalopen, "totalclosed"=>$totalclosed, "totalspecialists"=>$totalspecialists, "softwarepercent"=>$softwarepercent, "totalhardware"=>$totalhardware, "totalpending"=>$totalpending, "totalongoing"=>$totalongoing, "totalsolved"=>$totalsolved, "avg"=>$displayavg, "specialistsolve"=>$specialistsolve, "totalresolved"=>$totalresolved, "operatorsolve"=>$operatorsolve, "availablepercent"=>$availablepercent, "totaltags"=>$totaltags, "totalnotarchived"=>$totalnotarchived));
?>