<?php
	
	include("../connection.php");
  	//$output = call_page('http://192.168.15.20/php/targit_report/get_teile_data.php');
  
  	$contents = file_get_contents('http://192.168.15.20/php/targit_report/get_masch_data.php');
	

	$json_data = json_decode(json_encode($contents), True);
	$json_data = json_decode($json_data,true);
	echo sizeof($json_data);
	//print_r($json_data);
	for ($i=0; $i < sizeof($json_data); $i++) { 
		//print_r( $json_data[$i]['MaschineNr']."<br>");

		$query = "INSERT INTO SD_maschine ( masch_nr, masch_bez, 	aktiv) VALUES ('".$json_data[$i]['MaschineNr']
		."','".$json_data[$i]['MaschineBez']."',".$json_data[$i]['Aktiv'].")";

		if (mysqli_query($con, $query)) {
		    //echo "1";
		} else {
			echo "NOT INSERTED - ".$json_data[$i]['MaschineNr'];
		}
	}
?>
