
<?php
  include("../connection.php");
  require_once("../lib/Encoding.php");
  use \ForceUTF8\Encoding;  // It's namespaced now.
  

  $query = "SELECT *,date(insert_time) as only_date, month(insert_time) as month  from v_full_data_tpm WHERE masch_id='".$_GET['m_nr']."'";

  $result = mysqli_query($con,$query);
  

  $result_list_daily = [];
  $result_list_weekly = [];
  $result_list_monthly = [];
  $result_list_other = [];

  $task_list_daily = [];
  $task_list_weekly = [];
  $task_list_monthly = [];
  $task_list_other = [];

  $result_list = [];
  $task_list = [];
  while($r = mysqli_fetch_assoc($result)) {

    $result_list[] = Encoding::toUTF8($r); 
    switch($r['task_occur']){
      case "0":
        $result_list_daily[] =$r;
        break;
      case "1":
        $result_list_weekly[] =$r;
        break;
      case "2":
        $result_list_monthly[] =$r;
        break;
      case "3":
        $result_list_other[] =$r;
        break;
      case "4":
        $result_list_other[] =$r;
        break;
    }  
  }

  $query_2 = "select * from t_tasks_list";
  $result_2 = mysqli_query($con,$query_2);
  while($r = mysqli_fetch_assoc($result_2)) {

    $task_list[] = Encoding::toUTF8($r);
    switch($r['task_occur']){
      case "0":
        $task_list_daily[] =$r;
        break;
      case "1":
        $task_list_weekly[] =$r;
        break;
      case "2":
        $task_list_monthly[] =$r;
        break;
      case "3":
        $task_list_other[] =$r;
        break;
      case "4":
        $task_list_other[] =$r;
        break;
    }
  }
  //print_r("<pre>");
  //print_r($result_list_daily);


  /* PREPARE DAILY LIST */
  $arr = getLastNDays(10, 'Y-m-d');
  for ($i=0; $i < sizeof($task_list_daily); $i++) { 
    for ($j=0; $j < sizeof($arr); $j++) { 
      $task_list_daily[$i][$arr[$j]]= get_status_day($result_list_daily, $arr[$j],$task_list_daily[$i]['uid']);
    }
  }


  /*PREPARE WEEKLY DATA */
  $arr_week = getPreviousWeeks();
  for ($i=0; $i < sizeof($task_list_weekly); $i++) { 
    for ($j=0; $j < sizeof($arr_week); $j++) { 
      $task_list_weekly[$i][$arr_week[$j]['week']]= get_status_week($result_list_weekly, $arr_week[$j]['week'],$arr_week[$j]['year'], $task_list_weekly[$i]['uid']);
    }
  }


  $arr_months = getPreviousMonths();
  for ($i=0; $i < sizeof($task_list_monthly); $i++) { 
    for ($j=0; $j < sizeof($arr_months); $j++) {
      $task_list_monthly[$i][$arr_months[$j]['month']."-".$arr_months[$j]['year']]= get_status_month($result_list_monthly, $arr_months[$j]['month'],$arr_months[$j]['year'], $task_list_monthly[$i]['uid']);

    }
  }

  $result->free();
  $data = array('daily' => $task_list_daily, 'weekly'=>$task_list_weekly, 'monthly'=>$task_list_monthly,"other"=>$task_list_other,'dates'=>$arr,'weeks'=>$arr_week,"months" => $arr_months );


  echo json_encode($data);
  mysqli_close($con);

  function get_status_month($data,$month, $year, $id){
    for($i=0; $i< sizeof($data);$i++){

      //echo $data[$i]['only_date']." ---- ".$a_date." ".$id;
      if($data[$i]['month'] == $month && $data[$i]['year'] == $year && $data[$i]['task_id'] == $id){
        //return 1;
        return array('val' => $data[$i]['input_value'] , 'up' => $data[$i]['other']);
      }
    }
  }

  function get_status_week($data,$week, $year, $id){
    for($i=0; $i< sizeof($data);$i++){

      //echo $data[$i]['only_date']." ---- ".$a_date." ".$id;
      if($data[$i]['week_year'] == $week && $data[$i]['year'] == $year && $data[$i]['task_id'] == $id){
        //return 1;
        return array('val' => $data[$i]['input_value'] , 'up' => $data[$i]['other']);
      }
    }
  }

  function get_status_day($data, $a_date,$id){
    //echo sizeof($data);
    for($i=0; $i< sizeof($data);$i++){

      //echo $data[$i]['only_date']." ---- ".$a_date." ".$id;
      if($data[$i]['only_date'] == $a_date && $data[$i]['task_id'] == $id){
        //return 1;
        return array('val' => $data[$i]['input_value'] , 'up' => $data[$i]['other']);
      }
    }
  }

  function getPreviousMonths(){
    for ($i = 0; $i < 10; $i++) {
      $months[] = array ('month'=>date("m", strtotime( date( 'Y-m-01' )." -$i months")), 'year'=> date("Y", strtotime( date( 'Y-m-01' )." -$i months")), 'full'=> date("m-Y", strtotime( date( 'Y-m-01' )." -$i months")));
    }
    return $months;
  }

  function getPreviousWeeks(){
    $i = 0;
    $weekArray = array();
    while ($i < 10) {
      $weekArray[] = array('week' => date('W', strtotime("-$i week")), 'year'=>date('Y', strtotime("-$i week")));
      $i++;
    }
    return array_reverse($weekArray);
  }

  function getLastNDays($days, $format = 'd/m'){
    $m = date("m"); $de= date("d"); $y= date("Y");
    $dateArray = array();
    for($i=0; $i<=$days-1; $i++){
        $dateArray[] =  date($format, mktime(0,0,0,$m,($de-$i),$y)); 
    }
    return array_reverse($dateArray);
  }


 ?>
