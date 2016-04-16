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

    /*$scope.game = new Phaser.Game(
     800,600,
     Phaser.AUTO,
     'gameCanvas'
     );*/

    $scope.player1 = {
        id: 0,
        name: "annonymus",
        priority: 0
    };

    //socket.emit('lol',$scope.player1);

    //socket.emit('connection', function(socket){
    //socket.emit('clientConnected', $scope.player1);

    socket.playerColor = $scope.playerColor();
    socket.roomId = $scope.roomId();

    $scope.player = {
        id: $scope.playerId,
        color: socket.playerColor,
        room: socket.roomId
    };

    socket
        .emit('initPlayer', $scope.player)
        .emit('connectToRoom', socket.roomId)
        .on('disconnect', function (socket) {
            socket.broadcast.to(socket.roomId).emit('user disconnected');
        })
        .on('leave', function(userName){
            alert(userName + " leave");
        })
        .on('disconnect', function(){
            this.$emit('error');
        })
        .on('error', function(reason){
            if (reason == "handshake unauthorized") {
                alert("вы вышли из сайта");
            } else {
                setTimeout(function() {
                    socket.socket.connect();
                }, 500);
            }
        });

        //socket.join(socket.roomId);


    $scope.playerId++;
    //})

});
