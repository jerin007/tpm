
<?php
include("../connection.php");
require_once("../lib/Encoding.php");
use \ForceUTF8\Encoding;  // It's namespaced now.

$id= $_GET['id'];
$query = "SELECT * from t_job_list where group_id='$id'";
$result = mysqli_query($con,$query);

$result_list = [];
while($r = mysqli_fetch_assoc($result)) {

    $result_list[] = Encoding::toUTF8($r);
}

$result->free();

for ($i=0; $i < sizeof($result_list); $i++) {
    if($result_list[$i]["id"]){

        // Getting group name
        $query = "SELECT group_name FROM 
 
 WHERE id=".$result_list[$i]["group_id"];

        $result = mysqli_query($con,$query);

        while($r = mysqli_fetch_assoc($result))
        {
            $result_list[$i]["groups"][] = Encoding::toUTF8($r);
        }
        $result->free();



        // Getting input type name

        $query = "SELECT name FROM t_input_type WHERE id=".$result_list[$i]["input_type_id"];

        $result = mysqli_query($con,$query);

        while($r = mysqli_fetch_assoc($result))
        {
            $result_list[$i]["input_type"][] = Encoding::toUTF8($r);
        }
        $result->free();


        // Getting responsible name

        $query = "SELECT resp_name FROM t_responsible WHERE id=".$result_list[$i]["responsible_id"];

        $result = mysqli_query($con,$query);

        while($r = mysqli_fetch_assoc($result))
        {
            $result_list[$i]["responsible"][] = Encoding::toUTF8($r);
        }
        $result->free();


        // Getting occurence type

        $query = "SELECT name FROM t_occurrence WHERE id=".$result_list[$i]["task_occur_type"];

        $result = mysqli_query($con,$query);

        while($r = mysqli_fetch_assoc($result))
        {
            $result_list[$i]["occurtype"][] = Encoding::toUTF8($r);
        }
        $result->free();

    }
}

echo json_encode($result_list);
mysqli_close($con);


?>
