<?php
include '../connection.php';

$job_id ='';
$define_color = $_POST['define_color'];

$color = json_decode(stripslashes($_POST['possible_color']));
$query = "INSERT INTO t_job_list (name,group_id,input_type_id, responsible_id,task_occur_type,task_occur_time,status) 
          VALUES ('".$_POST['name']."',".$_POST['group_id'].",'".$_POST['input_type_id']."' ,".$_POST['responsible_id'].",'".$_POST['task_occure_type']."','".$_POST['task_occur_time']."','1')";
//echo " QUERY IS ".$query;
//var_dump($color);die();

if (mysqli_query($con, $query)) {
    $job_id = mysqli_insert_id($con);
    echo "1";
} else {
    echo mysqli_error($con);
}
if($define_color == 1){
    foreach($color as $c){
        $value = $c -> value;
        $color = $c -> color;
        $query = "INSERT INTO t_input_value_color (job_id,possible_value,color) VALUES('".$job_id."','".$value."','".$color."')";
        if (mysqli_query($con, $query)) {
           // echo "1";
        } else {
            echo mysqli_error($con);
        }
    }
}
mysqli_close($con);
?>
