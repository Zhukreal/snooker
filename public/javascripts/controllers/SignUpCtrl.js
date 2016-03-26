var app = angular.module('SignUpCtrl', []);

app.controller('SignUpController', function ($scope) {
    $scope.hello = "Sigup page";
    /*$scope.onAttachmentSelect = function () {
        var logo = new FileReader();
        logo.onload = function (event) {
            console.log('the img has loaded');
            var file = event.currentTarget.files[0];
            console.log('Filename:' + file.name);
            $scope.image = file;
            $scope.logoName = file.name;
            $scope.$apply();
            $scope.saveUserImage();

        };
        logo.readAsDataURL(file[0]);
        $scope.file = file[0];
        $scope.getFileData = file[0].name;
        reader.readAsDataURL(file);
    };

    $scope.saveuserImage = function () {
        console.log("STARGING UPLOAD");
        $scope.upload = $upload.upload({  // Using $upload
            url: '/user/' + $stateParams.id + '/userImage',
            method: 'put',
            data: $scope.image,
            file: $scope.file
        }).progress(function (evt) {
            })
            .success(function () {
                location.reload();
                $scope.file = "";
                $scope.hideUpload = 'true'
            });
        $scope.getFileData = '';
        //        location.reload()
    };*/

/*    $scope.uploadFile = function(){

        var file = $scope.myFile;
        var uploadUrl = "/multer";
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl,fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
                console.log("success!!");
            })
            .error(function(){
                console.log("error!!");
            });
    };*/


    $scope.onFileSelect = function(image) {
        $scope.uploadInProgress = true;
        $scope.uploadProgress = 0;

        if (angular.isArray(image)) {
            image = image[0];
        }

        $scope.upload = $upload.upload({
            url: '/api/v1/upload/image',
            method: 'POST',
            data: {
                type: 'profile'
            },
            file: image
        }).progress(function(event) {
            $scope.uploadProgress = Math.floor(event.loaded / event.total);
            $scope.$apply();
        }).success(function(data, status, headers, config) {
            AlertService.success('Photo uploaded!');
        }).error(function(err) {
            $scope.uploadInProgress = false;
            AlertService.error('Error uploading file: ' + err.message || err);
        });
    };


});
