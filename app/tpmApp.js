
// -------------------------------- Created By Jerin Jahan (30.11.2017) -------------------------------

var app = angular.module('myApp', ['ngSanitize','ui.select', 'ngTouch', 'ui.grid', 'ui.grid.pinning']);
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    e.target
    e.relatedTarget
});
app.controller('myCtrl',function ($scope, $http,$filter, $log,$compile) {
    start_spinner();
    $scope.group_list=[];
    $scope.masch_list=[];
    $scope.process_list=[];
    $scope.select_group='';
    $scope.group_id=0;
    $scope.resposible_name=[];
    $scope.occurrence=[];
    $scope.input_type=[];
    $scope.define_color=0;
    $scope.possible_value_color=[];
    $scope.color='';
    $scope.task_occur_time='';
    var colorCount = 1;
    $scope.mintu = [00, 15, 30, 45];


    $('.select').select2();
    //Date picker
    $('#datetimepickermonthly').datetimepicker({
        format: 'DD.MM.YYYY'
    });
    $('#datetimepickeryearly').datetimepicker({
        format: 'DD.MM.YYYY'
    });

    $scope.gridOptions = {enableColumnMenus: false};
    $scope.gridOptions.columnDefs = [
        { field:'process_obj', width:66, displayName:' ', cellTemplate: '<div style="width: 100%; display: table; height: 100%;"><span style="display: table-cell;text-align: center;vertical-align: middle;"><button type="button" class="btn btn-success" ng-click="grid.appScope.edit_task(row.entity.process_obj)"><i class="fa fa-lg fa-pencil-square-o" aria-hidden="true"></i></button></span></div>', pinnedLeft:true, enableSorting: false  },
        { field:'name', width:310, displayName:'Massnahme', pinnedLeft:true, enableSorting: false, cellTemplate: '<div style="width: 100%; display: table; height: 100%;"><span style="padding: 10px; display: table-cell; vertical-align: middle;">{{row.entity.name}}</span></div>' },
        { field:'resp_name', width:150, displayName:'Zustandig', pinnedLeft:true, enableSorting: false, cellTemplate: '<div style="width: 100%; display: table; text-align: center; height: 100%;" ng-class="grid.appScope.get_user_color(row.entity.resp_name)"><span style="display: table-cell;text-align: center;vertical-align: middle;">{{row.entity.resp_name}}</span></div>' },
        { field:'input_type', cellFilter:'input_typ', width:80, displayName:'Input Typ', pinnedLeft:true, enableSorting: false, cellTemplate: '<div style="width: 100%; display: table; height: 100%;"><span style="display: table-cell;text-align: center;vertical-align: middle;">{{row.entity.input_type_name}}</span></div>' },
        { field:'task_occur', cellFilter:'pro_occur', width:90, displayName:'Wie oft', pinnedLeft:true, enableSorting: false, cellTemplate: '<div style="width: 100%; display: table; height: 100%;"><span style="display: table-cell;text-align: center;vertical-align: middle;">{{row.entity.occurence_name}}</span></div>' },
        { field:'task_occur_time', width:110, displayName:'Zeitpunkt', pinnedLeft:true, enableSorting: false, cellTemplate: '<div style="width: 100%; display: table; height: 100%;"><span style="display: table-cell; word-wrap: break-word; word-break: break-all; padding:5px; text-align: center;vertical-align: middle;">{{row.entity.task_occur_time}}</span></div>' },
    ];

    $http.get("php/get/get_masch_group_list.php")
        .success(function (response) {
            $scope.group_list = response;
            var group_id=$scope.group_list[0].id;
            $scope.group_id = group_id;
            //LOAD MACHINE JOB LISTS
            $scope.loadMachine(group_id,0,response[0].group_name);
            stop_spinner();
        });
    //TAB LI CLICK LOAD MACHINE JOB LISTS
    $scope.loadMachine = function(id,index,name) {
        //start_spinner();
        $scope.select_group = name;
        $scope.gridOptions.data=[];
        $scope.process_list = [];
        $scope.masch_list = [];
        $scope.gridOptions =[];
        $scope.gridOptions.columnDefs=[];

        $scope.gridOptions = {enableColumnMenus: false};
        $scope.gridOptions.columnDefs = [
            { field:'process_obj', width:66, displayName:' ', cellTemplate: '<div style="width: 100%; display: table; height: 100%;"><span style="display: table-cell;text-align: center;vertical-align: middle;"><button type="button" class="btn btn-success" ng-click="grid.appScope.edit_task(row.entity.process_obj)"><i class="fa fa-lg fa-pencil-square-o" aria-hidden="true"></i></button></span></div>', pinnedLeft:true, enableSorting: false  },
            { field:'name', width:310, displayName:'Massnahme', pinnedLeft:true, enableSorting: false, cellTemplate: '<div style="width: 100%; display: table; height: 100%;"><span style="padding: 10px; display: table-cell; vertical-align: middle;">{{row.entity.name}}</span></div>' },
            { field:'resp_name', width:150, displayName:'Zustandig', pinnedLeft:true, enableSorting: true, enableFiltering: true, cellTemplate: '<div style="width: 100%; display: table; text-align: center; height: 100%;" ng-class="grid.appScope.get_user_color(row.entity.resp_name)"><span style="display: table-cell;text-align: center;vertical-align: middle;">{{row.entity.resp_name}}</span></div>' },
            { field:'input_type', cellFilter:'input_typ', width:80, displayName:'Input Typ', pinnedLeft:true, enableSorting: false, enableFiltering: true,cellTemplate: '<div style="width: 100%; display: table; height: 100%;"><span style="display: table-cell;text-align: center;vertical-align: middle;">{{row.entity.input_type_name}}</span></div>' },
            { field:'task_occur', cellFilter:'pro_occur', width:90, displayName:'Wie oft', pinnedLeft:true, enableSorting: false, enableFiltering: true,cellTemplate: '<div style="width: 100%; display: table; height: 100%;"><span style="display: table-cell;text-align: center;vertical-align: middle;">{{row.entity.occurence_name}}</span></div>' },
            { field:'task_occur_time', width:110, displayName:'Zeitpunkt', pinnedLeft:true, enableSorting: false, cellTemplate: '<div style="width: 100%; display: table; height: 100%;"><span style="display: table-cell; word-wrap: break-word; word-break: break-all; padding:5px; text-align: center;vertical-align: middle;">{{row.entity.task_occur_time}}</span></div>' },
        ];

        //GET MACHINE LIST
        $http.get("php/get/get_masch_list.php?group_id="+id)
            .success(function (masch_response) {
                $scope.masch_list= masch_response;
                $http.get('php/get/get_masch_data_for_grid.php?group_id='+id)
                    .success(function(response) {
                        $scope.gridOptions.data = response.data;
                        $scope.process_list = response.data;
                        var masch_count = 0;
                        // append particular maschine data
                        angular.forEach(masch_response, function(value, key) {
                            var thTemplate = '<div style="width: 100%; display: table; height: 100%;" ' +
                                'ng-click="grid.appScope.set_masch_status(row.entity.uid,row.entity.process_index,row.entity.masch['+key+'].position_in_mask)">' +
                                '<i style="display: table-cell;text-align: center;vertical-align: middle; font-size:20px;" ' +
                                'ng-class="grid.appScope.get_masch_status(row.entity.masch_mask, row.entity.masch['+key+'].position_in_mask)"></i>' +
                                '</div>';
                            $scope.gridOptions.columnDefs.push({
                                field:"th"+masch_count, displayName: value.masch_name, width:80, enableSorting: false, cellTemplate: thTemplate
                            });
                            masch_count++;
                        });
                        // set all data for maschine
                        for(var i=0; i<$scope.gridOptions.data.length; i++){
                            for(var j=0; j<masch_response.length; j++){
                                $scope.gridOptions.data[i]['th'+j] = masch_response[j].position_in_mask;
                            }
                        }

                    });
            });
        $("#liClass_"+index).attr('class', 'liClass_'+index);
        stop_spinner();
    }
    //SET TAB LI CLASS
    $scope.liClass = function(index){
        if(index == 0){
            return "liClass_1 nav-link active";
        }
        index++;
        return 'nav-link liClass_'+index;
    };
    //SET TAB DIV CLASS
    $scope.tabClass=function(index){
        if(index == 0){
            return "tab-pane active";
        }
        else{
            return "tab-pane";
        }
    }
    $scope.get_user_color = function(user){
        switch(user){
            case "Fluidmanager":
                return "class-fluidman";
            case "Maschinenbediener":
                return "class-maschbed";
            case "Einrichter oder Instandhaltung":
                return "class-einrichter";
            case "Einrichter":
                return "class-einrichter";
            case "Instandhaltung":
                return "class-ins";
            case "Instandhalter el.":
                return "class-insel";
            case "Schichtführer":
                return "class-schichtfu";
            default:
                return "Error";
        }
    };

    $scope.open_pro_ins_modal = function(){
        $scope.resposible_name=[];
        $scope.occurrence=[];
        $scope.input_type=[];

        $scope.ins_data = {};
        $scope.ins_data.pro_name = "";
        $scope.ins_data.sel_user_type = 0;
        $scope.ins_data.sel_input_type = 0;
        $scope.ins_data.sel_occur_type = 0;
        $scope.define_color =0;


        $scope.occur = {};
        $scope.occur.daily = {};
        $scope.occur.daily.hour = '';
        $scope.occur.daily.min = '';

        $scope.occur.weekly = {};
        $scope.occur.weekly.day = '';
        $scope.occur.weekly.hour = '';
        $scope.occur.weekly.min = '';

        $scope.occur.monthly = {};
        $scope.occur.monthly.week = '';
        $scope.occur.monthly.day = '';
        $scope.occur.monthly.interval = '';
        $scope.occur.monthly.hour = '';
        $scope.occur.monthly.min = '';

        $scope.occur.shift = {};
        $scope.occur.shift.hour_1 = '';
        $scope.occur.shift.min_1 = '';
        $scope.occur.shift.hour_2 = '';
        $scope.occur.shift.min_2 = ''
        $scope.occur.shift.hour_3 = '';
        $scope.occur.shift.min_3 = '';

        $scope.occur.yearly = {};
        $scope.occur.yearly.date = '';
        $scope.occur.yearly.hour = '';
        $scope.occur.yearly.min = '';


        $scope.occur.list = {};
        $scope.occur.list.hour = '';
        $scope.occur.list.min = '';

        $scope.occur.time_define = {};
        $scope.occur.time_define.hour_1_1 = '';
        $scope.occur.time_define.min_1_1 = '';
        $scope.occur.time_define.hour_1_2 = '';
        $scope.occur.time_define.min_1_2 = '';
        $scope.occur.time_define.hour_2_1 = '';
        $scope.occur.time_define.min_2_1 = '';
        $scope.occur.time_define.hour_2_2 = '';
        $scope.occur.time_define.min_2_2 = '';
        $scope.occur.time_define.hour_3_1 = '';
        $scope.occur.time_define.min_3_1 = '';
        $scope.occur.time_define.hour_3_2 = '';
        $scope.occur.time_define.min_3_2 = '';
        $scope.time_list_ins = [];

        //Get Responsible Name From Database
        $http.get("php/get/get_responsible_name.php")
            .success(function (response) {
                $scope.resposible_name = response;
            });
        //Get Input Type From Database
        $http.get("php/get/get_input_type.php")
            .success(function (response) {
                $scope.input_type = response;
            });
        //Get Occurrence From Database
        $http.get("php/get/get_occurrence.php")
            .success(function (response) {
                $scope.occurrence = response;
            });

        var height = $(window).height() - 200;
        //$("#mdl_new_prc_body").css("max-height", height);
        $("#mdl_new_prc").modal("show");
    };
    $scope.onInputChange = function(val){
        if(val > 0){
            $scope.define_color = document.getElementById('input_'+val).getAttribute("data-val");
            $scope.color = document.getElementById('input_'+val).getAttribute("data-color");
            $scope.possible_value_color=[];
        }
    }
    $scope.addDefineColor = function(id){
        $('#btnAddColor'+id).hide();
        id++;
        var tableRow ='<tr id="tr_'+id+'">'+
            '<td width="10%">'+
            '<input class="form-control" placeholder="Value" name="txtValue_'+id+'" id="txtValue_'+id+'" onchange="onChangePossibleValue('+id+',this.value)">'+
            '</td>'+
            '<td width="30%">'+
            '<input class="form-control jscolor" value="'+$scope.color+'" name="txtColor_'+id+'" id="txtColor_'+id+'">'+
            '</td>'+
            '<td width="30%">'+
            '<button class="btn btn-success btnColorAdd" id="btnAddColor'+id+'" ng-click="addDefineColor('+id+')" style="margin-right: 2%!important;" disabled><i class="fa fa-plus"></i></button>'+
            '<button class="btn btn-danger btnColorAdd" id="btnRemoveColor'+id+'" ng-click="removeDefineColor('+id+')"><i class="fa fa-close"></i></button>'+
            '</td>'+
            '</tr>';

        var compiledString = $compile(tableRow)($scope);
        $("#tbl_color").append(compiledString);
        var picker = new jscolor($('#txtColor_'+id)[0]);
    }
    $scope.removeDefineColor= function (id) {
        var lastId = $('#tbl_color > tbody > tr').last().attr('id').split('_')[1];
        $('#tr_'+id).remove();
        var preid = $('#tbl_color > tbody > tr').last().attr('id').split('_')[1];
        if(id == 2 || id == lastId){
            $('#btnAddColor'+preid).show();
        }
    }


    $scope.isFromValid = function()
    {
        if ($scope.ins_data.pro_name == "") {
            show_err_msg("Bitte geben Sie den Prozessnamen ein");
            return 0;
        }
        if($scope.ins_data.sel_user_type == 0 ){
            show_err_msg("Bitte geben Sie den Prozessnamen ein");
            return 0;
        }
        if($scope.ins_data.sel_input_type == 0 ){
            show_err_msg("Please select input type");
            return 0;
        }
        if($scope.ins_data.sel_occur_type == 0 ){
            show_err_msg("Please select occurrence");
            return 0;
        }
        if($scope.define_color == 1 ){
            // show_err_msg("Please select input type");
            // return 0;
        }
        if($scope.ins_data.sel_occur_type > 1){
            if($scope.ins_data.sel_occur_type == 1 && $scope.occur.daily.hour == ''){
                show_err_msg("Please select daily input");
                return 0;
            }
            if($scope.ins_data.sel_occur_type == 1 && $scope.occur.daily.min == ''){
                show_err_msg("Please select daily input");
                return 0;
            }
        }
        return 1
    }

    // INSERT NEW JOBS
    $scope.insert_new_process = function(){
        if ($scope.isFromValid() == 1){
            $scope.possible_value_color =[];
            if($scope.define_color == 1){
                $('.jscolor ').each(function () {
                    var id = $(this).attr('id').split('_')[1];
                    $scope.possible_value_color.push({value:$('#txtValue_'+id).val(),color:$('#txtColor_'+id).val()});
                })
            }

            if($scope.ins_data.sel_occur_type == 1){
                $scope.task_occur_time =$scope.occur.daily.hour+':'+$scope.occur.daily.min;
            }
            if($scope.ins_data.sel_occur_type == 2){
                $scope.task_occur_time = $scope.occur.weekly.hour+':'+$scope.occur.weekly.min+','+$scope.occur.weekly.day+','+$scope.occur.weekly.interval;
            }
            if($scope.ins_data.sel_occur_type == 3){
                $scope.task_occur_time = $scope.occur.monthly.hour+':'+$scope.occur.monthly.min+','+ moment(document.getElementById('datetimepickermonthly').value, 'MM.YYYY').format('YY')+','+$scope.occur.monthly.interval;
            }
            if($scope.ins_data.sel_occur_type == 4){
                $scope.task_occur_time =$scope.occur.yearly.hour+':'+$scope.occur.yearly.min+','+ moment(document.getElementById('datetimepickeryearly').value, 'MM.YYYY').format('YY,dd');
            }
            if($scope.ins_data.sel_occur_type == 5){
                $scope.task_occur_time = $scope.occur.shift.hour_1+':'+$scope.occur.shift.min_1+','+$scope.occur.shift.hour_2+':'+$scope.occur.shift.min_2+','+$scope.occur.shift.hour_3+':'+$scope.occur.shift.min_3;
            }
            if($scope.ins_data.sel_occur_type == 6){
                $scope.task_occur_time = $scope.occur.time_define.hour_1_1+':'+$scope.occur.time_define.min_1_1+','+$scope.occur.time_define.hour_1_2+':'+$scope.occur.time_define.min_1_2+','+
                                         $scope.occur.time_define.hour_2_1+':'+$scope.occur.time_define.min_2_1+','+$scope.occur.time_define.hour_2_2+':'+$scope.occur.time_define.min_2_2+','+
                                         $scope.occur.time_define.hour_3_1+':'+$scope.occur.time_define.min_3_1+','+$scope.occur.time_define.hour_3_2+':'+$scope.occur.time_define.min_3_2;
            }
            var pass_data = "name="+$scope.ins_data.pro_name+"&group_id="+$scope.group_id+"&input_type_id="+$scope.ins_data.sel_input_type+
                            "&responsible_id="+$scope.ins_data.sel_user_type+"&task_occure_type="+$scope.ins_data.sel_occur_type+
                            "&task_occur_time="+$scope.task_occur_time+"&possible_color="+JSON.stringify($scope.possible_value_color)+'&define_color='+$scope.define_color;
            $.ajax({
                type: 'POST',
                url: 'php/post/insert_process_tpm.php',
                data: pass_data,
                success: function (data) {
                    if(data == 1){

                        // $("#mdl_new_prc").modal("hide");
                        // $http.get("php/get/get_masch_data_for_grid.php")
                        //     .success(function (response) {
                        //         $scope.gridOptions.data = response.data;
                        //         $scope.process_list = response.data;
                        //
                        //     });
                        show_success_msg("Successfully Inserted");
                    }else{

                        show_err_msg("Process Not Inserted");

                    }
                    console.log(data);
                }
            });
        }
        else{
            console.log( $scope.ins_data.pro_name +""+$scope.ins_data.sel_user_type+" "+$scope.ins_data.sel_input_type+" "+$scope.ins_data.sel_occur_type);
        }

        // if($scope.ins_data.pro_name != "" && $scope.ins_data.sel_user_type != null && $scope.ins_data.sel_input_type != null && $scope.ins_data.sel_occur_type!= null){
        //
        //     var time_occur = $scope.preocess_time_occur();
        //     if(time_occur != false){
        //         var raw_data = "name="+$scope.ins_data.pro_name+"&input_type="+$scope.ins_data.sel_input_type+
        //             "&responsible="+$scope.ins_data.sel_user_type+"&task_occur="+$scope.ins_data.sel_occur_type+"&task_occur_time="+time_occur;
        //         // $.ajax({ //Process the form using $.ajax()
        //         //     type: 'POST', //Method type
        //         //     url: 'php/post/insert_process_tpm.php', //Your form processing file URL
        //         //     data: raw_data, //Forms name
        //         //     success: function (data) {
        //         //         if(data == 1){
        //         //
        //         //             $("#mdl_new_prc").modal("hide");
        //         //             $http.get("php/get/get_masch_data_for_grid.php")
        //         //                 .success(function (response) {
        //         //                     $scope.gridOptions.data = response.data;
        //         //                     $scope.process_list = response.data;
        //         //
        //         //                 });
        //         //             show_success_msg("Succesfully Inserted");
        //         //         }else{
        //         //
        //         //             show_err_msg("Process Not Inserted");
        //         //
        //         //         }
        //         //         console.log(data);
        //         //     }
        //         // });
        //     }
        // }else{
        //     show_err_msg_short("Please Fill All Values");
        // }

    };











    $scope.edit_task = function(task){
        //console.log(task);

        $scope.sel_edit_pro = task;

        $scope.edit_data = {};
        $scope.edit_data.pro_name = task.name;
        $scope.edit_data.sel_user_type= task.responsible;
        $scope.edit_data.sel_input_type= task.input_type;
        $scope.edit_data.sel_occur_type= task.task_occur;

        $scope.occur_edit = {};
        $scope.occur_edit.daily = {};
        $scope.occur_edit.daily.hour = null;

        $scope.occur_edit.weekly = {};
        $scope.occur_edit.weekly.day = null;
        $scope.occur_edit.weekly.hour = null;

        $scope.occur_edit.monthly = {};
        $scope.occur_edit.monthly.week = null;
        $scope.occur_edit.monthly.day = null;
        $scope.occur_edit.monthly.hour = null;

        $scope.occur_edit.shift = {};
        $scope.occur_edit.shift.hour_1 = null;
        $scope.occur_edit.shift.hour_2 = null;
        $scope.occur_edit.shift.hour_3 = null;

        $scope.occur_edit.time_define = {};
        $scope.occur_edit.time_define.hour_1_1 = null;
        $scope.occur_edit.time_define.hour_1_2 = null;
        $scope.occur_edit.time_define.hour_2_1 = null;
        $scope.occur_edit.time_define.hour_2_2 = null;
        $scope.occur_edit.time_define.hour_3_1 = null;
        $scope.occur_edit.time_define.hour_3_2 = null;

        var main_spl = task.task_occur_time.split(",");

        switch($scope.edit_data.sel_occur_type){
            case "0":
                var splited = main_spl[0].split(":");
                $scope.occur_edit.daily.hour = splited[0];
                break;
            case "1":
                $scope.occur_edit.weekly.day = main_spl[0];
                var splited = main_spl[1].split(":");
                $scope.occur_edit.weekly.hour = splited[0];
                break;
            case "2":
                $scope.occur_edit.monthly.week = main_spl[0];
                $scope.occur_edit.monthly.day = main_spl[1];
                var splited = main_spl[2].split(":");
                $scope.occur_edit.monthly.hour = splited[0];
                break;
            case "3":

                var splited_1 = main_spl[0].split(":");
                $scope.occur_edit.shift.hour_1 = splited_1[0];

                var splited_2 = main_spl[1].split(":");
                $scope.occur_edit.shift.hour_2 = splited_2[0];

                var splited_3 = main_spl[2].split(":");
                $scope.occur_edit.shift.hour_3 = splited_3[0];
                break;
            case "4":

                var splited_1 = main_spl[0].split(":");
                $scope.occur_edit.time_define.hour_1_1 = splited_1[0];

                var splited_2 = main_spl[1].split(":");
                $scope.occur_edit.time_define.hour_1_2 = splited_2[0];

                var splited_3 = main_spl[2].split(":");
                $scope.occur_edit.time_define.hour_2_1 = splited_3[0];

                var splited_4 = main_spl[3].split(":");
                $scope.occur_edit.time_define.hour_2_2 = splited_4[0];

                var splited_5 = main_spl[4].split(":");
                $scope.occur_edit.time_define.hour_3_1 = splited_5[0];

                var splited_6 = main_spl[5].split(":");
                $scope.occur_edit.time_define.hour_3_2 = splited_6[0];

                break;
        }

        $("#mdl_edit_prc").modal('show');
    }
    // update maschine data
    $scope.update_process = function(){

        console.log($scope.sel_edit_pro);

        console.log( $scope.edit_data.pro_name +""+$scope.edit_data.sel_user_type+" "+$scope.edit_data.sel_input_type+" "+$scope.edit_data.sel_occur_type);
        if($scope.edit_data.pro_name != "" && $scope.edit_data.sel_user_type != null && $scope.edit_data.sel_input_type != null && $scope.edit_data.sel_occur_type!= null){

            var time_occur = $scope.preocess_time_occur_edit();

            if(time_occur != false){

                var raw_data = "name="+$scope.edit_data.pro_name+"&input_type="+$scope.edit_data.sel_input_type+"&responsible="+$scope.edit_data.sel_user_type+"&task_occur_time="+time_occur+"&uid="+$scope.sel_edit_pro.uid;
                console.log(raw_data);
                $.ajax({ //Process the form using $.ajax()
                    type: 'POST', //Method type
                    url: 'php/put/update_process_data.php', //Your form processing file URL
                    data: raw_data, //Forms name
                    success: function (data) {
                        if(data == 1){

                            $("#mdl_edit_prc").modal("hide");
                            $http.get("php/get/get_masch_data_for_grid.php")
                                .success(function (response) {
                                    $scope.process_list = response.data;
                                    $scope.gridOptions.data = response.data;

                                });
                            show_success_msg("Succesfully Updated");
                        }else{

                            show_err_msg("Process Not Inserted");

                        }
                        console.log(data);
                    }
                });
            }
        }else{
            show_err_msg_short("Please Fill All Values");
        }

    };
    // save maschine data
    $scope.save_masch_selection = function(){
        var raw_data = "values=";
        for (var i = 0; i < $scope.gridOptions.data.length; i++) {
            raw_data+= "("+$scope.gridOptions.data[i].uid+","+$scope.gridOptions.data[i].masch_mask+"),";
        }

        var raw_data = raw_data.slice(0, -1);
        $.ajax({ //Process the form using $.ajax()
            type: 'POST', //Method type
            url: 'php/put/update_process_masch.php', //Your form processing file URL
            data: raw_data, //Forms name
            success: function (data) {
                if(data == 1){
                    $http.get("php/get/get_masch_data_for_grid.php")
                        .success(function (response) {
                            $scope.process_list = response.data;
                            $scope.gridOptions.data = response.data;

                        });
                    show_success_msg("Succesfully Updated");
                }else{

                    show_err_msg("Process Not Inserted");
                }
                //console.log(data);
            }
        });
    };
    $scope.preocess_time_occur = function(){
        console.log($scope.ins_data.sel_occur_type);
        switch($scope.ins_data.sel_occur_type){
            case "0":
                if($scope.occur.daily.hour != null){
                    return $scope.occur.daily.hour+":00";
                }else{
                    return false;
                }
                break;
            case "1":
                if($scope.occur.weekly.day != null && $scope.occur.weekly.hour != null){
                    return $scope.occur.weekly.day +","+ $scope.occur.weekly.hour +":00";
                }else{
                    return false;
                }
                break;
            case "2":
                if($scope.occur.monthly.week != null && $scope.occur.monthly.day != null && $scope.occur.monthly.hour != null){
                    return $scope.occur.monthly.week+","+$scope.occur.monthly.day +","+ $scope.occur.monthly.hour +":00";
                }else{
                    return false;
                }
            case "3":
                if($scope.occur.shift.hour_1 != null && $scope.occur.shift.hour_2 != null && $scope.occur.shift.hour_3 != null){
                    return $scope.occur.shift.hour_1+":00,"+ $scope.occur.shift.hour_2 +":00,"+ $scope.occur.shift.hour_3 +":00";
                }else{
                    return false;
                }
            case "4":
                if($scope.occur.time_define.hour_1_1 != null && $scope.occur.time_define.hour_1_2 != null && $scope.occur.time_define.hour_2_1 != null && $scope.occur.time_define.hour_2_2 != null && $scope.occur.time_define.hour_3_1 != null && $scope.occur.time_define.hour_3_2 != null){
                    return $scope.occur.time_define.hour_1_1 +":00,"+ $scope.occur.time_define.hour_1_2 +":00,"+$scope.occur.time_define.hour_2_1 +":00,"+$scope.occur.time_define.hour_2_2 +":00,"+$scope.occur.time_define.hour_3_1 +":00,"+$scope.occur.time_define.hour_3_2 +":00";
                }else{
                    return false;
                }

            /*return $scope.time_list_ins.join(",");
            break;*/
            default :
                return false;
        }

    };
    $scope.preocess_time_occur_edit = function(){
        console.log($scope.edit_data.sel_occur_type);
        switch($scope.edit_data.sel_occur_type){
            case "0":
                if($scope.occur_edit.daily.hour != null){
                    return $scope.occur_edit.daily.hour+":00";
                }else{
                    return false;
                }
                break;
            case "1":
                if($scope.occur_edit.weekly.day != null && $scope.occur_edit.weekly.hour != null){
                    return $scope.occur_edit.weekly.day +","+ $scope.occur_edit.weekly.hour +":00";
                }else{
                    return false;
                }
                break;
            case "2":
                if($scope.occur_edit.monthly.week != null && $scope.occur_edit.monthly.day != null && $scope.occur_edit.monthly.hour != null){
                    return $scope.occur_edit.monthly.week+","+$scope.occur_edit.monthly.day +","+ $scope.occur_edit.monthly.hour +":00";
                }else{
                    return false;
                }
            case "3":
                if($scope.occur_edit.shift.hour_1 != null && $scope.occur_edit.shift.hour_2 != null && $scope.occur_edit.shift.hour_3 != null){
                    return $scope.occur_edit.shift.hour_1+":00,"+ $scope.occur_edit.shift.hour_2 +":00,"+ $scope.occur_edit.shift.hour_3 +":00";
                }else{
                    return false;
                }
            case "4":
                if($scope.occur_edit.time_define.hour_1_1 != null && $scope.occur_edit.time_define.hour_1_2 != null && $scope.occur_edit.time_define.hour_2_1 != null && $scope.occur_edit.time_define.hour_2_2 != null && $scope.occur_edit.time_define.hour_3_1 != null && $scope.occur_edit.time_define.hour_3_2 != null){
                    return $scope.occur_edit.time_define.hour_1_1 +":00,"+ $scope.occur_edit.time_define.hour_1_2 +":00,"+$scope.occur_edit.time_define.hour_2_1 +":00,"+$scope.occur_edit.time_define.hour_2_2 +":00,"+$scope.occur_edit.time_define.hour_3_1 +":00,"+$scope.occur_edit.time_define.hour_3_2 +":00";
                }else{
                    return false;
                }

            /*return $scope.time_list_ins.join(",");
            break;*/
            default :
                return false;
        }

    };
    $scope.add_time_in_list = function(){
        if($scope.occur.list.hour != null && $scope.occur.list.min != null){
            $scope.time_list_ins.push($scope.occur.list.hour+":"+$scope.occur.list.min);
            $scope.occur.list.hour = null;
            $scope.occur.list.min = null;
        }
    };
    $scope.remove_time_list = function(index){
        $scope.time_list_ins.splice(index, 1);
    };
    $scope.get_masch_status = function(value,pos){
        var bin_val = decbin(value,$scope.masch_list.length);
        var splited = bin_val.split("");
        var actual_pos = (splited.length -1) - pos;
        if(splited[actual_pos] == 1){
            return "fa fa-check bg-default";
        }else{
            return "";
        }
        return "";
    };
    $scope.set_masch_status = function(id,index,pos){
        var value = $scope.gridOptions.data[index].masch_mask;
        var bin_val = decbin(value,$scope.masch_list.length);
        var splited = bin_val.split("");
        var actual_pos = (splited.length -1) - pos;
        if(splited[actual_pos] == 1){
            splited[actual_pos] = 0;
        }else{
            splited[actual_pos] = 1;
        }
        var binary = splited.join("");
        var digit = parseInt(binary, 2);
        $scope.gridOptions.data[index].masch_mask = digit;
    };

});

app.directive('enterPress', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            //console.log(event.which);
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.enterPress);
                });
                event.preventDefault();
            }
        });
    };
});
app.filter('range', function() {
    return function(input, total) {
        //total = parseInt(total);
        try{
            //console.log(total)
            var divs = total.split(",");

            for(var i =0 ; i< divs.length; i++){
                var r = divs[i].split("_");
                var start = parseInt(r[0]);
                var end = parseInt(r[1]);
                for (var j=start; j<end; j++) {
                    if( j < 10){
                        input.push("0"+j);
                    }else{
                        input.push(j);
                    }
                }
            }


            return input;
        }catch(err){}
    };
});
app.filter('input_typ', function() {
    return function(x) {
        switch(x){
            case "0":
                return "Text";
            case "1":
                return "Number";
            case "2":
                return "Yes\/No";
            case "3":
                return "Date";
            case "4":
                return "Y\/N Text";
            default:
                return "Error";
        }
    };
});
app.filter('pro_occur', function() {
    return function(x) {
        switch(x){
            case "0":
                return "Daily";
            case "1":
                return "Weekly";
            case "2":
                return "Monthly";
            case "3":
                return "Per Shift";
            case "4":
                return "Time Define";
            default:
                return "Error";
        }
    };
});
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "preventDuplicates": false,
    "positionClass": "toast-bottom-right",
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": 5000,
    "extendedTimeOut": 0,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    "tapToDismiss": false
};


function onChangePossibleValue(id,val){
    if(val == ''){
        $('#btnAddColor'+id).attr('disabled',true);
    }else{
        $('#btnAddColor'+id).attr('disabled',false);
    }
}
function decbin(dec,length){
    var out = "";
    while(length--)
        out += (dec >> length ) & 1;
    return out;
}
function start_spinner(){
    var spin_div = document.getElementById("spinner");
    spinner1 = new Spinner().spin();
    spin_div.appendChild(spinner1.el);
}
function show_success_msg(msg){
    toastr.options.positionClass = "toast-bottom-right";
    toastr.options.progressBar = true;
    toastr.options.timeOut = 3000;
    toastr.success(msg);
}
function show_err_msg(msg){
    toastr.options.positionClass = "toast-bottom-right";
    toastr.options.timeOut = 3000;
    toastr.error(msg);
}
function show_err_msg_short(msg){
    toastr.options.positionClass = "toast-bottom-right";
    toastr.options.progressBar = true;
    toastr.options.timeOut = 3000;
    toastr.error(msg);
}
function stop_spinner(){
    spinner1.stop();
}
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[#?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1])||null;
}
