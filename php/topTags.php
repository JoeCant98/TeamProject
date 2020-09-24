<?php
//topTags.php
//Adam Morley

//this file outputs an array of tags and the amount of times they exist in the database
//it outputs the top 5 results in descending order
//this file is called from view-analytics.js
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

	//SQL to select top 5 tags, how many times they appear in db and in order 
	$sql = "SELECT tag, COUNT( * ) FROM  Tags GROUP BY tag ORDER BY COUNT( * ) DESC LIMIT 0, 5";

	//execute query
	$res =& $db->query($sql);

	if (PEAR::isError($res)) {
		die($res->getMessage());
	}
	$allData = Array();
	while ($row = $res->fetchRow()) {
		//store results in appropriate variables
		$tag = $row[0];
		$count = $row[1];
		//store variables in array for each tag
		array_push($allData, array("tag"=>$tag, "count"=>$count));
	}
	//echo results
	echo json_encode($allData);

?>

