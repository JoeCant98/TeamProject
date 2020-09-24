<?php
//getUsers.php
//Tom Snelling | Joe Graham

//this file accesses the database and selects users of a type specified when the file is called
//it outputs the results in an array
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

	$table = "Users";
	
	//set specified type to variable
	$type = $_GET['type']; // either Operator or Specialist

	//SQL to get data for users of specified type
	$sql = "SELECT * FROM $table WHERE type='$type'";
	
	//execute query
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

	$allData = Array();
	while ($row = $res->fetchRow()) {
		//save user data in array
		$id = $row[0];
		$user = $row[1];
		$name = $row[4]." ".$row[5];
		
		//add array for each user into output array
		array_push($allData, array("id"=>$id, "user"=>$user, "name"=>$name));
	}
	//echo results
	echo json_encode($allData);

?>