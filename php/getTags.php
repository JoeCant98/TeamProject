<?php
//getTags.php
//Tom Snelling

//this file loads all the tags associated with a ticket id sent to this file
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

	$table = "Tags";
	//set id sent to file as variable
	$getId = $_GET['id'];

	//SQL to select all tags with correct id
	$sql = "SELECT tag FROM $table WHERE id=$getId";

	//execute query
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}

	$tags = Array();
	while ($row = $res->fetchRow()) {
		//add each tag to an array
		array_push($tags, $row[0]);
	}
	
	//echo array
	echo json_encode(array("tags"=>$tags));

?>