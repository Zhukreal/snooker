var app = angular.module('SignUpCtrl', ['ngFileUpload']);

app.controller('SignUpController', ['$scope', 'Upload', function ($scope, Upload) {

    $scope.hello = "hello";

    // upload later on form submit or something similar
    $scope.submit = function() {
        if ($scope.form.file.$valid && $scope.file) {
            $scope.upload($scope.file);
        }
    };

    //$scope.clickToR = function(){
    //    if($scope.form.file === "undefined")
    //        $scope.temp = "nil";
    //    $scope.temp = $scope.form.file || "empty";
    //};

    // upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: '/signup',
            data: {file: file, 'username': $scope.nickname}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            //alert(angular.toJson($scope.form.file));
            //alert(resp.config.data.file);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };



}]);
