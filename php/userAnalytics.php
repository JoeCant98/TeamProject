<?php
//userAnalytics.php
//Adam Morley | Tom Snelling

//this file accesses the database to calculate select information on each specialist and output the results in an array
//this file is called from specialist-analytics.js, create-issue.js
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

	//SQL to select ticket and user information for each specialist including returning the user when no data exists
	$sql = "SELECT a.closed, b.open, a.username, firstname, lastname, available FROM (SELECT COUNT(*) AS 'closed', Specialists.username FROM Specialists LEFT JOIN Tickets ON Specialists.username = Tickets.specialist AND status = 'solved' GROUP BY Specialists.username) AS a LEFT JOIN (SELECT COUNT(*) AS 'open', Specialists.username FROM Specialists LEFT JOIN Tickets ON Specialists.username = Tickets.specialist AND status = 'pending' OR 'ongoing' GROUP BY Specialists.username) AS b ON a.username = b.username JOIN Users ON a.username = Users.username";

	//execute sql
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

	$allData = Array();
	while ($row = $res->fetchRow()) {
		//store results as appropriate variables
		$closedtickets = $row[0];
		$opentickets = $row[1];
		$specialist = $row[2];
		$name = $row[3] . ' ' . $row[4];
		$available = $row[5];
		//if no results for ticket counts set to 0
		if ($closedtickets == null) {
			$closedtickets = 0;
		}

		if ($opentickets == null) {
			$opentickets = 0;
		}
		//store variables in array
		array_push($allData, array("closedtickets"=>$closedtickets, "specialist"=>$specialist, "opentickets"=>$opentickets, "name"=>$name, "available"=>$available));
	}
	//output results
	echo json_encode($allData);

?>

