<?php
//loadProblemTypes.php
//Tom Snelling

//this file loads all problem types
//it stores the results in an array and outputs the array
//this file is called from create-issue.js
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

	$tabel_problem_types = "Problemtypes";
	
	//SQL to select all information in table
	$sql = "SELECT * FROM $tabel_problem_types";

	//execute query
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

	$allData = Array();
	while ($row = $res->fetchRow()) {
		//store results in appropriate variables
		$id = $row[0];
		$desc = $row[1];
		$subtype_of = $row[2];
		//each row is stored in an array which is then stored in another array
		array_push($allData, array("id"=>$id, "description"=>$desc, "subtype_of"=>$subtype_of));
	}

	//output array
	echo json_encode($allData);

?>