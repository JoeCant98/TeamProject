<?php
//getUserType.php
//Tom Snelling

//this file accesses the database a username and type that match the username sent when the file was called
//it outputs the results in an array
//this file is called from common.js
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

	//set specified username as variable
	$username = $_GET['username'];

	//SQL to select all data associated with username in table
	$sql = "SELECT * FROM $table_users WHERE username='$username'";
	
	//run query
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

	while ($row = $res->fetchRow()) {
		//save data as variables
		$user = $row[1];
		$type = $row[3];
	}
	//add variables to array and output array
	echo json_encode(array("user"=>$user, "type"=>$type));

?>