<?php
//loadTickets.php
//Tom Snelling | Adam Morley

//this file acceses the database and selects all data for every ticket
//it then outputs some of this data in an array for every ticket
//this file is called from all-issues.js
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

	$table_tickets = "Tickets";

	//SQL to select all tickets data
	$sql = "SELECT * FROM $table_tickets";

	//execute query
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

	$allData = Array();
	while ($row = $res->fetchRow()) {
		//store results in appropriate variables
		$first_name = $row[0];
		$last_name = $row[1];
		$specialist = $row[2];
		$type = $row[3];
		$summary = $row[4];
		$details = $row[5];
		$id = $row[6];
		$status = $row[7];
		$timestamp = $row[8];
		$operator = $row[9];
		$email = $row[10];
		$followup = $row[11];
		$isArchived = $row[12];
	
		//store some variables in an array as an element of another array
		array_push($allData, array("type"=>$type, "summary"=>$summary, "id"=>$id, "status"=>$status, "timestamp"=>$timestamp, "isArchived"=>$isArchived));
	}
	//echo results
	echo json_encode($allData);

?>