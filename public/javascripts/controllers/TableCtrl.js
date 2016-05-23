var app = angular.module('Table', [])
    .controller('TableCtrl', function ($scope) {
        $scope.hello = "msg";

        console.log("this is %clol","color:red;font-size:50px;");





        var socket = io.connect('localhost:8080/tables');



        socket
            .on('totalCountOfUsers', function (data) {
                $scope.uCount = data.length;
                $scope.$apply();
            })
            .on('countOfIncompleteRooms', function (data, fn) {
                $scope.generateRoomName = function(){
                    console.log(data);
                    if (data.count == 0) {
                        $scope.roomName = data.rndRoomName;
                    } else {
                        $scope.roomName = data.firstRoom.name;
                    }
                    //$scope.$apply();
                    //alert($scope.roomName);
                    fn($scope.roomName);
                }

            })


    });