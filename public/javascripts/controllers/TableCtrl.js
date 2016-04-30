var app = angular.module('Table', [])
    .controller('TableCtrl', function ($scope) {
        $scope.hello = "msg";

        var socket = io.connect('/',{
            reconnect: false
        });




        socket
            .on('numberOfRooms', function(data){
                console.log(data);
            })
            /*.on('userCount', function (data) {
                $scope.uCount = data.userCount;
                $scope.$apply();
                console.log("count of users ",data.userCount);
            })*/
            .on('countTemp', function(data){
                $scope.uCount = data.length;
                $scope.$apply();
            })

    });