<?php
/**
 * Created by PhpStorm.
 * User: sct-user
 * Date: 12/4/2017
 * Time: 6:08 PM
 */

include("../connection.php");
require_once("../lib/Encoding.php");
use \ForceUTF8\Encoding;  // It's namespaced now.

$query = "SELECT * from t_input_type";
$result = mysqli_query($con,$query);

$result_list = [];
while($r = mysqli_fetch_assoc($result)) {
    $result_list[] = Encoding::toUTF8($r);
}

$result->free();
echo json_encode($result_list);
mysqli_close($con);
?>
