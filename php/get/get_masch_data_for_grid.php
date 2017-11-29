
<?php
	include("../connection.php");
	require_once("../lib/Encoding.php");
	use \ForceUTF8\Encoding;  // It's namespaced now.

	$masch_query = "SELECT * from sd_masch_list";
	$masch_result = mysqli_query($con,$masch_query);

	$masch_list = [];
	$header_list = [];
	$data_list = [];
	array_push($header_list,['name' => ' ']);
	array_push($header_list,['name' => 'Massnahme']);
	array_push($header_list,['name' => 'Zustandig']);
	array_push($header_list,['name' => 'Input Typ']);
	array_push($header_list,['name' => 'Wie oft']);
	array_push($header_list,['name' => 'Zeitpunkt']);
  
	while($rr = mysqli_fetch_assoc($masch_result)) {
		array_push($header_list,['name' => Encoding::toUTF8($rr['name'])]);	
	}
	$masch_result->free();
	
	$peocess_query = "SELECT * from t_tasks_list";
	$peocess_result = mysqli_query($con,$peocess_query);
	$peocess_list = [];
	$i = 0;
	while($r = mysqli_fetch_assoc($peocess_result)) {
		$r['process_index'] = $i;
		$r['process_obj'] = Encoding::toUTF8($r);
		$data_list[$i] = Encoding::toUTF8($r);
		$masch_query = "SELECT * from sd_masch_list";
		$masch_result = mysqli_query($con,$masch_query);
		$j = 0;
		while($rr = mysqli_fetch_assoc($masch_result)) {
			$data_list[$i]['masch'][$j] = Encoding::toUTF8($rr);
			$j++;
		}
		$masch_result->free();
		$i++;
	}
	$peocess_result->free();


	// echo '<pre>';
	// print_r(['headerlist' => $header_list, 'data' => $data_list]);
	// exit();

	echo json_encode(['headerlist' => $header_list, 'data' => $data_list]);
	mysqli_close($con);


 ?>
