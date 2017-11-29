<?php

  include '../connection.php';

  $query = "INSERT INTO t_tasks_list (name,input_type,responsible,task_occur, task_occur_time) VALUES ('".$_POST['name']."',".$_POST['input_type'].",'".$_POST['responsible']."' ,".$_POST['task_occur'].",'".$_POST['task_occur_time']."')";
  //echo " QUERY IS ".$query;

  if (mysqli_query($con, $query)) {
      echo "1";      
  } else {
      echo mysqli_error($con);
  }

  mysqli_close($con);

?>
