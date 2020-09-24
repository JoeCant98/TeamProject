<?php
//setAvailability.php
//Tom Snelling

//this file receives a username when it is called
//it updates that users availability based on the value specified
//this file is called from specialist-issues.js
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

	$table_users = "Users";
	
	//set specified values to appropriate variables
	$specialist = $_GET['specialist'];
	$availability = $_GET['availability'];

	//SQL to update users availability based on variable
	$sql = "UPDATE $table_users SET available=$availability WHERE username='$specialist'";

	//execute sql
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		echo $res->getMessage();
		die($res->getMessage());
	}

?>