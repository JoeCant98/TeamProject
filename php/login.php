<?php
//login.php
//Tom Snelling

//this file receives a specified username and password when it is called
//it selects all data associated with the specified username and password
//it outputs some of this data in an array
//some elements of the array will be empty if the login was incorrect
//this file is called from login.js
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
	//set specified values as variables
	$username = $_GET['username'];
	$password = $_GET['password'];

	//SQL query to select all information on user whose login matches specified values
	$sql = "SELECT * FROM $table_users WHERE username='$username' AND password='$password'";

	//execute sql
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

	while ($row = $res->fetchRow()) {
		//store some results as variables
		$user = $row[1];
		$type = $row[3];
	}
	//output stored results as array
	echo json_encode(array("user"=>$user, "type"=>$type));

?>