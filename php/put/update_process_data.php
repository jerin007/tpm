<?php

  include '../connection.php';


  $query = "UPDATE t_tasks_list SET name='".$_POST['name']."', input_type=".$_POST['input_type'].",responsible='".$_POST['responsible']."',task_occur_time='".$_POST['task_occur_time']."'  WHERE uid=".$_POST['uid'];
  //echo " QUERY IS ".$query;

  if (mysqli_query($con, $query)) {
      echo "1";
  } else {
      echo  mysqli_error($con);
  }
  mysqli_close($con);

?>
