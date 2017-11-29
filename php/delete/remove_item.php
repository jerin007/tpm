<?php

  include '../connection.php';

  $table = $_POST['table'];
  $del_rec = $_POST['data'];


  $query = "DELETE FROM ".$table." WHERE ".$del_rec."";

  if (mysqli_query($con, $query)) {
      echo "1";
  } else {
      echo mysqli_error($con);
  }

  mysqli_close($con);

?>
