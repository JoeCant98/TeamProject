<?php
//createResolution.php
//Tom Snelling | Timo Kiukkanen

//this file accesses the database and creates a resolution for a ticket
//it populates the fields with data entered by the user and updates the ticket status
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

	$table_retickets = "Resolvedtickets";

	//get data enetered by user and set to appropriate variables
	//get ticket id
	$id = $_GET['id'];
	$solvedby = $_GET['operator'];
	$resolution_detail = $_GET['resolutionDetail'];
	
	//SQL to enter data into correct fields for correct ticket
	$sql = "INSERT INTO $table_retickets (id, solvedby, details) VALUES ('$id', '$solvedby', '$resolution_detail')";
	
	//execute SQL
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		echo $res->getMessage();
		die($res->getMessage());
	}

	$table_tickets = "Tickets";
	
	//SQL to update ticket status to correct value now solved
	$sql = "UPDATE $table_tickets SET status='solved' WHERE id='$id'";
	
	//execute SQL
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		echo $res->getMessage();
		die($res->getMessage());
	}

?>