<?php

  include '../connection.php';


  $query = "INSERT INTO  t_tasks_list(uid,masch_mask) VALUES".$_POST['values']." ON DUPLICATE KEY UPDATE uid=VALUES(uid),masch_mask=VALUES(masch_mask)";
  //echo " QUERY IS ".$query;

  if (mysqli_query($con, $query)) {
      echo "1";
  } else {
      echo  mysqli_error($con);
  }
  mysqli_close($con);

?>
