'use strict';


angular


    .module('app', ['angularFileUpload'])


    .controller('AppController', ['$scope', 'FileUploader', function($scope, FileUploader) {
        $scope.artikel = "";
        $scope.ifd_number="";
        $scope.teile_nr="";
        $scope.datum="";
        $scope.zeichnungs_nr="";
        $scope.fach_form="";
        $scope.form_nr="";

        $scope.alu="";
        $scope.steigrohr_o="";
        $scope.badtemperatur="";
        $scope.nachlaufzeit="";
        $scope.dosiergewicht="";

        $scope.machine="";
        $scope.g_position="";
        $scope.kolbendurchmesser="";
        $scope.caro_prometa="";
        $scope.kolbenschmierung_ol="";
        $scope.kolbenschmierung_Umdr="";
        $scope.granulat="";
        $scope.gr="";
        $scope.phase1="";
        $scope.phase1_per="";
        $scope.phase2="";
        $scope.phase2_per="";
        $scope.phase3="";
        $scope.phase3_per="";
        $scope.Vakuum_start="";
        $scope.Vakuum_stop="";
        $scope.formoffnungshub="";
        $scope.auswerferhub="";
        $scope.multiplikatordruck="";
        $scope.biconst="";
        $scope.pressrest="";
        $scope.akkudruck="";
        $scope.formschliebzeit="";
        $scope.formschliebzeit_2="";
        $scope.multi="";
        $scope.auswerfer_vor="";
        $scope.akkuladezeit="";
        $scope.auswerfer_zuruck="";
        $scope.giebkolbenspruhzeit="";
        $scope.form_zu="";
        $scope.schussverzogerung="";
        $scope.form_auf="";
        $scope.Verz_giebkolben_zuruck="";
        $scope.kernzug_vor="";
        $scope.Verz_auswerfer_zuruck="";
        $scope.Kernzug_zuruck="";
        $scope.offnungszeit="";
        $scope.kernzug_vor2="";
        $scope.Kernzug_zuruck2="";
        $scope.bemerkungen="";


        $scope.fullstein_oder_Platte="";
        $scope.presse_offen="";
        $scope.pressgang="";
        $scope.pressgang_geschlossen="";
        $scope.zwischenhalt1="";
        $scope.zwischenhalt2="";
        $scope.niederhalter_druck="";
        $scope.teileubernahme_vor_druck="";
        

        $scope.geschwindigkeit_1_phase="";
        $scope.geschwindigkeit_1_phase_val="";
        $scope.taktzeit="";
        $scope.taktzeit_val="";
        $scope.geschwindigkeit_2_phase="";
        $scope.geschwindigkeit_2_phase_val="";
        $scope.hub_in_der_3_phase="";
        $scope.hub_in_der_3_phase_val="";
        $scope.umschaltpunkt="";
        $scope.umschaltpunkt_val="";
        $scope.druck_in_der_1_phase="";
        $scope.druck_in_der_1_phase_val="";
        $scope.hub_in_der_2_phase="";
        $scope.hub_in_der_2_phase_val="";
        $scope.temperatur_Kreis_1="";
        $scope.temperatur_Kreis_1_val="";
        $scope.formfullzeit="";
        $scope.formfullzeit_val="";
        $scope.temperatur_Kreis_2="";
        $scope.temperatur_Kreis_2_val="";
        $scope.pressreststarke="";
        $scope.pressreststarke_val="";
        $scope.temperatur_Kreis_3="";
        $scope.temperatur_Kreis_3_val="";
        $scope.geschwindigkeit_am_anschnitt="";
        $scope.geschwindigkeit_am_anschnitt_val="";
        $scope.temperatur_Kreis_4="";
        $scope.temperatur_Kreis_4_val="";
        $scope.fullbeginn_phase_2="";
        $scope.fullbeginn_phase_2_val="";
        $scope.temperatur_Kreis_5="";
        $scope.temperatur_Kreis_5_val="";
        $scope.nachdruck="";
        $scope.nachdruck_val="";
        $scope.temperatur_Kreis_6="";
        $scope.temperatur_Kreis_6_val=""; //ok
        $scope.druckaufbauzeit_phase_3="";
        $scope.druckaufbauzeit_phase_3_val="";
        $scope.temperatur_Kreis_7="";
        $scope.temperatur_Kreis_7_val="";
        $scope.spezifischer_giebdruck="";
        $scope.spezifischer_giebdruck_val="";
        $scope.temperatur_Kreis_8="";
        $scope.temperatur_Kreis_8_val="";
        $scope.vakuumventil_unterdruck_min="";
        $scope.konzentration_kuhlschmiermittel="";
        //$scope.="";


        var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php'
        });

        // FILTERS
      
        // a sync filter
        uploader.filters.push({
            name: 'syncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
        });
      
        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            console.log(response.name);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
        
    }]);
