<?php
//loadOneTicket.php
//Tom Snelling

//this file receives a specified ticket id and outputs an array containing all information on that ticket
//this includes information about the ticket resolution if it exists
//this file is called from view-issue.js
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

	//database tables
	$table_tickets = "Tickets";
	$table_retickets = "Resolvedtickets";

	//specified id as variable
	$getId = $_GET['id'];

	//SQL to get ticket information for ticket with specified id
	$sql = "SELECT * FROM $table_tickets WHERE id=$getId";
	
	//execute query
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

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
		$hwserial = $row[13];
		$osname = $row[14];
		$swname = $row[15];
		$swversion = $row[16];
		$swlicense = $row[17];
		$problem_type = $row[18];
	}
	
	//SQL to get resolution information on ticket with specified id
	$sql = "SELECT * FROM $table_retickets WHERE id=$getId";

	//execute query
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

	while ($row = $res->fetchRow()) {
		//store results in appropriate variables
		$resolved_by = $row[1];
		$resolution_details = $row[2];
		$resolved_at = $row[3];
	}

	//add results to an array and output array
	echo json_encode(array("firstName"=>$first_name, "lastName"=>$last_name, "specialist"=>$specialist, "type"=>$type, "problemtype"=>$problem_type, "summary"=>$summary,
		"details"=>$details, "id"=>$id, "status"=>$status, "timestamp"=>$timestamp, "operator"=>$operator, "email"=>$email, "followup"=>$followup,
		"isArchived"=>$isArchived, "hwserial"=>$hwserial, "osname"=>$osname, "swname"=>$swname, "swversion"=>$swversion, "swlicense"=>$swlicense, "solvedBy"=>$resolved_by, "solution"=>$resolution_details, "solvedAt"=>$resolved_at));

?>