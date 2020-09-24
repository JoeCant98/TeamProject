<?php
//deleteTicket.php
//Tom Snelling | Ghassan Ebrahim

//this file acceses the database and deletes the selected ticket
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

	$table = "Tickets";

	//get ticket id
	$id = $_GET['id'];
	
	//SQL to delete selected ticket
	$sql = "DELETE FROM $table WHERE id=$id";

	//execute SQL
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

?>