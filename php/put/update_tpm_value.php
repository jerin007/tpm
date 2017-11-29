<?php

  include '../connection.php';


  $query = "UPDATE t_tpm_data SET input_value='".$_POST['data']."', update_time=now(), is_active=0,other=1 WHERE uid=".$_POST['id'];
  //echo " QUERY IS ".$query;

  if (mysqli_query($con, $query)) {
      echo "1";
  } else {
      echo  mysqli_error($con);
  }
  mysqli_close($con);

?>
