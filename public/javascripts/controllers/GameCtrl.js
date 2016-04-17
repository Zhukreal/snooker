var app = angular.module('GameApp', []);

app.controller('GameController', function ($scope) {

    $scope.playerId = 0;

    $scope.playerColor = function () {
        return (!($scope.playerId % 2) ? "red" : "blue");
    };

    $scope.roomId = function () {
        return "room" + Math.floor($scope.playerId / 2);
    };

    var socket = io.connect('/', {
        //'reconnection delay': 1
        reconnect: false
    });

    $scope.temp = "temp";

    socket.playerColor = $scope.playerColor();
    socket.roomId = $scope.roomId();


    $scope.player = {
        nickname: $scope.nickname,
        id: $scope.playerId,
        color: socket.playerColor,
        room: socket.roomId
    };

    socket
        .on('initPlayer', function (data) {
            $scope.player.nickname = data.nickName;
            $scope.player.id = data.playerId;
            console.log($scope.player);
            $(document).ready(function () {
            })
        })
        .emit('initPlayer', $scope.player)
        .emit('connectToRoom', socket.roomId)
        .on('disconnect', function (socket) {
            //socket.broadcast.to(socket.roomId).emit('user disconnected');
        })
        .on('leave', function (userName) {
            alert(userName + " leave");
        })
        .on('disconnect', function () {
            this.$emit('error');
        })
        .on('error', function (reason) {
            if (reason == "handshake unauthorized") {
                alert("вы вышли из сайта");
            } else {
                setTimeout(function () {
                    socket.socket.connect();
                }, 500);
            }
        })
        .on('userCount', function(data){
            console.log(data.userCount);
        })

    //socket.join(socket.roomId);

    $scope.playerId++;
    //})

});
