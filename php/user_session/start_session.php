<?php 

    session_start();
    $user_name =  $_POST['u'];
    $pass = $_POST['p'];

    //include "../connection.php";
    
    $server = '192.168.15.20\SCT';
    $conn = mssql_connect($server, 'sqluser', '12345678');


    if( !$conn ){
        //echo "Connection could not be established.\n";
        echo 'can not connect';
        exit;
    }

    $query = "select PersonName,PersonNr,Nachname,Vorname,Email,Kurzzeichen,PermDocVisu FROM SCT.dbo.SD_PERSON WHERE Email='".$user_name."' AND Pwd='".$pass."'";

    $query_result = mssql_query($query, $conn);
    $count = 0;
    $full_data ;

    while ($row_sql = mssql_fetch_object($query_result)){
        //print_r($row_sql);
        $row = convert_object_to_array($row_sql);

        $real_name = utf8_encode( $row['PersonName']);
        $code_name =  $row['Kurzzeichen'];
        $doc_prm = $row['PermDocVisu'];
        $full_data = $row;
        $count ++;
    }

    if($count > 0){

        $_SESSION['doc_user'] = $real_name;
        $_SESSION['doc_code'] = $code_name;
        $_SESSION['doc_prm'] = $doc_prm;

        $session_data = array('user' => $_SESSION['doc_user'] , 'code' => $_SESSION['doc_code'], 'prm' => $_SESSION['doc_prm']);
        echo json_encode($session_data);
    }
    else{
        echo 0;
        //session_destroy();
        unset($_SESSION['doc_user']);

    }

    mssql_free_result($query_result); 

    function convert_object_to_array($data) {

        if (is_object($data)) {
            $data = get_object_vars($data);
        }

        if (is_array($data)) {
            return array_map(__FUNCTION__, $data);
        }
        else {
            return $data;
        }
    }

    
/*
    $query = "select * from t_person WHERE email='".$user_name."' AND pass='".$pass."'";

    $result = mysqli_query($con,$query);
    $count = 0;
    $first;

    while($r = mysqli_fetch_assoc($result)) {

        $real_name = utf8_encode( $r['full_name']); 
        $code_name =  $r['code_name'];      
        $count ++;
    }

    if($count > 0){

        $_SESSION['doc_user'] = $real_name;
        $_SESSION['doc_code'] = $code_name;

        $session_data = array('user' => $_SESSION['doc_user'] , 'code' => $_SESSION['doc_code']);
        echo json_encode($session_data);
    }
    else{
        echo 0;
        //session_destroy();
        unset($_SESSION['doc_user']);

    }

    mysqli_close($con);
   
*/
?>