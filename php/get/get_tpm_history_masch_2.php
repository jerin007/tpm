
<?php
  include("../connection.php");
  require_once("../lib/Encoding.php");
  use \ForceUTF8\Encoding;  // It's namespaced now.
  

  $query = "SELECT *,date(insert_time) as only_date, month(insert_time) as month, TIME_FORMAT(`insert_time`, '%H:%i') as time_task, FIND_IN_SET (TIME_FORMAT(`insert_time`, '%H:%i'),task_occur_time) as shift  from v_full_data_tpm WHERE masch_id='".$_GET['m_nr']."' ORDER BY date desc LIMIT 1000";

  $result = mysqli_query($con,$query);
  

  $result_list_daily = [];
  $result_list_weekly = [];
  $result_list_monthly = [];
  $result_list_other = [];

  $result_list_shift = [];

  $task_list_daily = [];
  $task_list_weekly = [];
  $task_list_monthly = [];
  $task_list_other = [];

  $task_list_shift = [];

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
        if($r['shift'] == "0"){
          $r['shift'] =  get_shift($r['time_task'], $r['task_occur_time']);
        }

        if($r['shift'] == 3){
          $time = explode(":",$r['time_task']);
          if( intval( $time[0]) < 6 ){
            $r['only_date'] = date('Y-m-d', strtotime($r['only_date'] .' -1 day'));
          }

        }

        $result_list_shift[] =$r;



        break;
      case "4":
        if($r['shift'] == 6){
          $time = explode(":",$r['time_task']);
          if( intval( $time[0]) < 6 ){
            $r['only_date'] = date('Y-m-d', strtotime($r['only_date'] .' -1 day'));
          }

        }
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
        //$task_list_other[] =$r;
        $task_list_shift[] =$r;
        break;
      case "4":
        $task_list_other[] =$r;
        break;
    }
  }


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


  /* PREPARE MONTHLY DATA */
  $arr_months = getPreviousMonths();
  for ($i=0; $i < sizeof($task_list_monthly); $i++) { 
    for ($j=0; $j < sizeof($arr_months); $j++) {
      $task_list_monthly[$i][$arr_months[$j]['month']."-".$arr_months[$j]['year']]= get_status_month($result_list_monthly, $arr_months[$j]['month'],$arr_months[$j]['year'], $task_list_monthly[$i]['uid']);
    }
  }


  /* PREPARE SHIFTLY DATA */
  $arr_shift_days = getLastNDays(4, 'Y-m-d');

  $arr_shift =[];
  for ($i=0; $i < sizeof($arr_shift_days); $i++) { 
    $arr_shift[]= array("full"=> $arr_shift_days[$i].":1", "date"=>$arr_shift_days[$i],"shift"=>1);
    $arr_shift[]= array("full"=> $arr_shift_days[$i].":2", "date"=>$arr_shift_days[$i],"shift"=>2);
    $arr_shift[]= array("full"=> $arr_shift_days[$i].":3", "date"=>$arr_shift_days[$i],"shift"=>3);
  }

  $arr_shift_nested =[];
  for ($i=0; $i < sizeof($arr_shift_days); $i++) { 
    $shift[]= array("full"=> $arr_shift_days[$i].":1", "date"=>$arr_shift_days[$i],"shift"=>1);
    $shift[]= array("full"=> $arr_shift_days[$i].":2", "date"=>$arr_shift_days[$i],"shift"=>2);
    $shift[]= array("full"=> $arr_shift_days[$i].":3", "date"=>$arr_shift_days[$i],"shift"=>3);
    $arr_shift_nested[] = array('date' => $arr_shift_days[$i],'data' => $shift );
  }

  for ($i=0; $i < sizeof($task_list_shift); $i++){ 
    for ($j=0; $j < sizeof($arr_shift); $j++) {
      $task_list_shift[$i][$arr_shift[$j]['full']]= get_status_shift($result_list_shift, $arr_shift[$j]['date'], $arr_shift[$j]['shift'] , $task_list_shift[$i]['uid']);

    }
  }


  /* PREPARE TIME DEFINED DATA */


  for ($i=0; $i < sizeof($arr_shift) ; $i++) { 
    $arr_shift[$i]['data']=array('frst' => $arr_shift[$i]['full']."_1", 'sec' => $arr_shift[$i]['full']."_2");
  }

  $arr_double_shift =[];
  for ($i=0; $i < sizeof($arr_shift_days); $i++) { 
    $arr_double_shift[]= array("full"=> $arr_shift_days[$i].":1_1", "date"=>$arr_shift_days[$i],"shift"=>"1_1");
    $arr_double_shift[]= array("full"=> $arr_shift_days[$i].":1_2", "date"=>$arr_shift_days[$i],"shift"=>"1_2");
    $arr_double_shift[]= array("full"=> $arr_shift_days[$i].":2_1", "date"=>$arr_shift_days[$i],"shift"=>"2_1");
    $arr_double_shift[]= array("full"=> $arr_shift_days[$i].":2_2", "date"=>$arr_shift_days[$i],"shift"=>"2_2");
    $arr_double_shift[]= array("full"=> $arr_shift_days[$i].":3_1", "date"=>$arr_shift_days[$i],"shift"=>"3_1");
    $arr_double_shift[]= array("full"=> $arr_shift_days[$i].":3_2", "date"=>$arr_shift_days[$i],"shift"=>"3_2");
  }

  for ($i=0; $i < sizeof($task_list_other); $i++) { 
    for ($j=0; $j < sizeof($arr_double_shift); $j++) { 
      //$first = get_status_other($result_list_other, $arr_shift[$j]['date'], $arr_shift[$j]['shift']."_1" , $task_list_other[$i]['uid']);
      //$sec = 

      $task_list_other[$i][$arr_double_shift[$j]['full']] = get_status_other($result_list_other, $arr_double_shift[$j]['date'], $arr_double_shift[$j]['shift'], $task_list_other[$i]['uid']);
     // $task_list_other[$i][$arr_shift[$j]['full']]= get_status_other($result_list_other, $arr_double_shift[$j]['date'], $arr_double_shift[$j]['shift'] , $task_list_other[$i]['uid']);
    }
  }

  /*
  print_r("<pre>");
  print_r($result_list_other);
  */

  $result->free();
  $data = array('daily' => $task_list_daily, 'weekly'=>$task_list_weekly, 'monthly'=>$task_list_monthly,'dates'=>$arr,'weeks'=>$arr_week,"months" => $arr_months, 'shiftly'=>$task_list_shift,'shifts'=>$arr_shift,'shifts_nested'=>$arr_shift_nested,'other'=>$task_list_other,'test'=>$result_list_other );


  echo json_encode($data);
  mysqli_close($con);

  function get_shift($time, $time_list){
    $list = explode(",", $time_list);
    $time_spl = explode(":", $time);
    $grt = false;
    for ($i=0; $i < sizeof($list); $i++) {

      $l_spl = explode(":", $list[$i]);
      if($i==0){
        if(intval($time_spl[0]) < intval($l_spl[0])){
          return sizeof($list);
        }else{
          $l_nxt = explode(":", $list[$i+1]);
          if(intval($time_spl[0]) > intval($l_spl[0]) && intval($time_spl[0]) < intval($l_nxt[0])){
            return ($i+1);
          }
        }
      }

      if($i == (sizeof($list)-1)){
        if(intval($time_spl[0]) > intval($l_spl[0])){
          return sizeof($list);
        }
      }

      $l_nxt = explode(":", $list[$i+1]);
      if(intval($time_spl[0]) > intval($l_spl[0]) && intval($time_spl[0]) < intval($l_nxt[0])){
        return ($i+1);
      }
    }

  }

  function get_status_other($data,$day, $shift, $id){
    for($i=0; $i< sizeof($data);$i++){

      //echo $data[$i]['shift']." ---- ".$shift."<br>";
      $spl = explode("_", $shift);
      $shift_nr = 0;

      //print_r("<pre>");
      //print_r($spl);
      //print_r($shift);

      switch ($spl[0]) {
        case "1":
          if($spl[1] == "1"){
            $shift_nr = 1;
          }elseif ($spl[1] == "2") {
            $shift_nr = 2;
          }
          break;
        case '2':
          if($spl[1] == "1"){
            $shift_nr = 3;
          }elseif ($spl[1] == "2") {
            $shift_nr = 4;
          }
          break;
        case '3':
          if($spl[1] == "1"){
            $shift_nr = 5;
          }elseif ($spl[1] == "2") {
            $shift_nr = 6;
          }
          break;
        default:
          break;
      }
     // print_r("<br>".$data[$i]['only_date'] ."....". $day ." --- ". $data[$i]['shift'] ."---". $shift_nr);
      if($data[$i]['only_date'] == $day && $data[$i]['shift'] == $shift_nr && $data[$i]['task_id'] == $id){
        //return 1;
        //print_r("<br>Inserted");
        return array('val' => $data[$i]['input_value'] , 'up' => $data[$i]['other']);
      }
    }
  }

  function get_status_shift($data,$day, $shift, $id){
    for($i=0; $i< sizeof($data);$i++){

      //echo $data[$i]['only_date']." ---- ".$a_date." ".$id;
      if($data[$i]['only_date'] == $day && $data[$i]['shift'] == $shift && $data[$i]['task_id'] == $id){
        //return 1;
        return array('val' => $data[$i]['input_value'] , 'up' => $data[$i]['other']);
      }
    }
  }

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
    return array_reverse($months);
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
