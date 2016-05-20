var app = angular.module('GameApp', []);

app.controller('GameController', function ($scope,$location) {

    /*$scope.playerId = 0;

     $scope.playerColor = function () {
     return (!($scope.playerId % 2) ? "red" : "blue");
     };

     $scope.roomId = function () {
     return "room" + Math.floor($scope.playerId / 2);
     };*/

    var socket = io.connect('/', {
        reconnect: false
    });

    /* $scope.temp = "temp";

     socket.playerColor = $scope.playerColor();
     socket.roomId = $scope.roomId();*/


    $scope.player = {
        nickname: "",
        turn: "",
        room: ""
    };

    /*


     $scope.uCount = 0;

     */

    console.info("path %s",$location.absUrl().split('/').pop());


    socket
        .on('connect', function () {
            console.log("You\'ve been connected successfully");
        })
        .on('reconnect', function () {
            console.log("You\'ve been reconnected");
        })
        .on('reconnecting', function () {
            console.log("Wait.You\'re reconnecting");
        })
        .emit('joinGameRoom',{'roomName':$location.absUrl().split('/').pop()})
        .on('lol',function(data){
            console.log(data);
        })

        /*.on('wait', function () {
         $("body").append("<pre>Waiting for the opponent...</pre>");
         console.log("Waiting for the opponent...")
         })
         .on('exit', function () {
         Snooker.endGame(Snooker.turn, 'exit');
         })*/
        /*.on('leave', function (userName) {
         alert(userName + " leave");
         })*/
        /*.on('userCount', function (data) {
         $scope.uCount = data.userCount;
         $scope.$apply();
         console.log("count of users ", data.userCount);
         })



         .on('ready', function (gameId, turn, opponent) {
         console.log("player" + opponent + "connected" + (turn == 1 ? "Your xod" : "Opponent xod"));
         })*/


        .on('initPlayer', function (data) {
            /*$scope.player.nickname = data.nickName;
            $scope.player.turn = "F";
            socket.on('roomKUI', function (data) {
                $scope.player.room = $location.absUrl().split('/').pop();
            })
            $scope.$apply();
            console.log($scope.player);

            $("body").append($scope.player.nickname);*/
            $scope.player.nickname = data.user.profile.nickname;
            $scope.player.turn = 'X';
            $scope.player.room = $location.absUrl().split('/').pop();
            $scope.$apply();
            //$('div.info').append($scope.player.nickname);
            //$('div.info span').append($scope.player.turn);
            console.log('player ',$scope.player);


        })
        /*
         .emit('initPlayer', $scope.player)

         .emit('addPlayerIntoATable', $scope.player)*/
        .on('message', function (data) {
            if ($scope.uCount == 1) {
                $("body").append("<br/>" + data.message);
            } else {
                $("body").append("<pre>Kick the ball!</pre>")
            }
        })
        .emit('connectToRoom', socket.roomId)
        .on('joinedToRoom', function (data) {
            console.log(data);
            $("body").append(data);
        })
        .on('countOfUsers', function (data) {
            console.log(data);
        })
        /*.on('numberOfRooms',function(data){
         console.log(data);
         })*/
        /*.on('disconnect', function (socket) {
         //socket.broadcast.to(socket.roomId).emit('user disconnected');
         })*/
        .on('leave',function(opponentName){
            alert(opponentName+" has gone")
        })
        .on('disconnect', function (userName) {
            //socket.emit('error');
            alert('${userName} disconnect');
        })
        .on('error', function (reason) {
            if (reason == "handshake unauthorized") {
                alert("вы вышли из сайта");
            } else {
                setTimeout(function () {
                    socket.connect();
                }, 500);
            }
        });
});
