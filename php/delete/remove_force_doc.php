<?php

  $doc_id = $_GET['doc_id'];

  $test = new DelHelper($doc_id);
  $test->recurr_folder($doc_id);
  $test->delete_all();

  class DelHelper{
      var $con;
      var $doc_list;
      var $file_list;

      function __construct(){
          $this->con = mysqli_connect("localhost","u_doc_man","test","doc_man");
          if (mysqli_connect_errno()){
              return "Failed to connect to MySQL: " . mysqli_connect_error();
          }
          $this->doc_list = array();
          $this->fol_list = array();
      }

      function __destruct(){
          mysqli_close($this->con);
      }

      function recurr_folder($folder_id){

          $query = "SELECT id_doc, is_folder, parent_id, file_location_alt, file_location_pdf_alt FROM t_doc_n_folder WHERE id_doc=".$folder_id. " OR parent_id=".$folder_id;
          
          $result = mysqli_query($this->con,$query);
          $result_list = array();

          while($r = mysqli_fetch_assoc($result)) {

              $result_list[] = $r;

              $this->add_doc($r['id_doc']);

              if($r['is_folder'] == 0){
                  $this->add_file($r['file_location_alt']);
                  if($r['file_location_pdf_alt']!= ""){
                      $this->add_file($r['file_location_pdf_alt']);
                  }
              }

              if($r['id_doc'] != $folder_id && $r['is_folder'] == 1){
                  $result_list[] = $this->recurr_folder($r['id_doc']);
              }
          }
          return $result_list;
      }

      function delete_all(){
          $this->delete_history();
          echo $this->delete_records();
          
          $this->delete_files();
      }

      function delete_records(){
          $ids = implode(",", $this->get_doc_list());

          $query = "DELETE FROM t_doc_n_folder WHERE id_doc in (".$ids.")";

          if (mysqli_query($this->con, $query)) {
              return "1";
          } else {
              return "\nERR Records".mysqli_error($this->con);
          }
      }

      function delete_history(){
          $ids = implode(",", $this->get_doc_list());

          $query = "DELETE FROM t_doc_history WHERE doc_id in (".$ids.")";

          if (mysqli_query($this->con, $query)) {
              return "1";
          } else {
              return "\nERR History".mysqli_error($this->con);
          }
      }

      function delete_files(){
          for($i = 0; $i < sizeof($this->file_list); $i++){
              $link = $this->file_list[$i];
              chmod($link, 666);
              try{ 
                  if(!is_writable($link))
                  //throw new Exception('File not writable');
                  unlink($link);
              }catch(Exception $e) { echo $e; }
          }
      }

      function add_doc($id){
        $this->doc_list[] = $id; 
      }

      function get_doc_list(){
          $arr = array_unique($this->doc_list);
          $arr = array_values($arr);
          return $arr;
      }

      function add_file($path){
        $this->file_list[] = $path; 
      }

      function get_file_list(){
          $arr = array_unique($this->file_list);
          $arr = array_values($arr);
          return $arr;
      }
      
  }


?>
