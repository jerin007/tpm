
<?php
  include("../connection.php");
  require_once("../lib/Encoding.php");
  use \ForceUTF8\Encoding;  // It's namespaced now.
  

  $query = "SELECT * from v_full_data_tpm WHERE masch_id='".$_GET['m_nr']."' AND is_active = 1";

  $result = mysqli_query($con,$query);
  

  $result_list = [];
  while($r = mysqli_fetch_assoc($result)) {

    $result_list[] = Encoding::toUTF8($r);
  }
  $result->free();

  echo json_encode($result_list);
  mysqli_close($con);


 ?>
