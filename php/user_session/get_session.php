<?php 

	session_start();

	if(isset($_SESSION['doc_user'])){
		$session_data = array('user' => $_SESSION['doc_user'], 'code' => $_SESSION['doc_code'], 'prm' => $_SESSION['doc_prm']);

		echo json_encode($session_data);
	}else{
		echo 0;
	}

?>