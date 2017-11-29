<?php
	
	include("../connection.php");
  	//$output = call_page('http://192.168.15.20/php/targit_report/get_teile_data.php');
  
  	$contents = file_get_contents('http://192.168.15.20/php/targit_report/get_teile_data.php');
	

	$json_data = json_decode(json_encode($contents), True);
	$json_data = json_decode($json_data,true);
	echo sizeof($json_data);
	//print_r($json_data);
	for ($i=0; $i < sizeof($json_data); $i++) { 
		//print_r( $json_data[$i]['TeileNr']."<br>");

		$query = "DELETE * FROM SD_teile; INSERT INTO SD_teile ( teile_nr, teile_bez, baugruppe) VALUES ('".$json_data[$i]['TeileNr']
		."','".$json_data[$i]['TeileBez']."','".$json_data[$i]['BaugruppeID']."')";

		if (mysqli_query($con, $query)) {
		    //echo "1";
		} else {
			echo "NOT INSERTED - ".$json_data[$i]['TeileNr'];
		}
	}
?>
