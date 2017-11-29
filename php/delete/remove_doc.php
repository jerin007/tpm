<?php

  include '../connection.php';

  $doc_id = $_POST['doc_id'];
  $is_folder = $_POST['is_folder'];
  $link = $_POST['link'];

  $query = "DELETE FROM t_doc_n_folder WHERE id_doc=".$doc_id;

  if (mysqli_query($con, $query)) {
      echo "1";
      if($is_folder == "0"){
        //unlink($link);
        //chdir($FilePath); // Comment this out if you are on the same folder
        //chown($link,465); //Insert an Invalid UserId to set to Nobody Owner; for instance 465
        chmod($link, 666);
        try {
          if(!is_writable($link))
            throw new Exception('File not writable');

          unlink($link);
        }
        catch(Exception $e) { echo $e; }
      }
  } else {
      echo mysqli_error($con);
  }

  mysqli_close($con);

?>
