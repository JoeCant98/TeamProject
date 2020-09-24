<?php
//update.php
//Tom Snelling | Adam Morley

//this file receives information for a ticket and updates the correct values for a specified ticket
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

	$table_tickets = "Tickets";

	//store received values in appropriate variables
	$id = $_GET['id'];
	$status = $_GET['status'];
	$first_name = $_GET['firstname'];
	$last_name = $_GET['lastname'];
	$email = $_GET['email'];
	$specialist = $_GET['specialist'];
	$type = $_GET['type'];
	$problem_type = $_GET['problemtype'];
	$summary = $_GET['summary'];
	$details = $_GET['details'];
	$hwserial = $_GET['hwserial'];
	$osname = $_GET['osname'];
	$swname = $_GET['swname'];
	$swversion = $_GET['swversion'];
	$swlicense = $_GET['swlicense'];
	$archived = $_GET['archived'];

	//SQL to update values for each field of the ticket with the appropriate variable
	$sql = "UPDATE $table_tickets SET status='$status', callerfirstname='$first_name', callerlastname='$last_name', specialist='$specialist', type='$type', summary='$summary', details='$details', email='$email', hwserial='$hwserial', osname='$osname', swname='$swname', swversion='$swversion', swlicense='$swlicense', problemtype='$problem_type', archived = '$archived' WHERE id='$id'";

	//execute sql
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		echo $res->getMessage();
		die($res->getMessage());
	}
	else {
		echo "OK";
	}

?>