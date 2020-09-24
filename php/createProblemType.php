<?php
//createProblemType.php
//Tom Snelling

//this file accesses the database and creates new problem types from user input
//this file is called from problem-types.js
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

	$table_problem_types = "Problemtypes";
	
	//get data entered by user and set to appropriate variables
	$desc = $_GET['description'];
	$subtype_of = $_GET['subtypeof'];
	
	//SQL to enter data into correct fields
	$sql = "INSERT INTO $table_problem_types (problem_type, subtype_of) VALUES ('$desc', '$subtype_of')";
	
	//execute SQL
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		echo $res->getMessage();
		die($res->getMessage());
	}
	else {
		echo "OK";
	}

?>