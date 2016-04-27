var app = angular.module('GameApp', []);

app.controller('GameController', function ($scope) {
    $(document).ready(function () {

        $scope.canvas = document.getElementById("myCanvas");
        $scope.ctx = $scope.canvas.getContext("2d");

        $scope.canvas.width = 1400;
        $scope.canvas.height = 700;

        $scope.background = new Image();
        $scope.ball = new Image();

        $scope.background.src = "../images/playerTable.png";
        $scope.ball.src = '../images/_ball.png';

        $scope.background.style.position = "relative";
        $scope.background.style.zIndex = 2;
        $scope.ballHeigh = 40;
        $scope.ballWidth = 40;

        $scope.ballRadius = 10;
        $scope.x = $scope.canvas.width*1/5;
        $scope.y = $scope.canvas.height/2 - 18;
        $scope.dx = 2;
        $scope.dy = -2;


        $scope.background.onload = function () {
            $scope.ctx.drawImage($scope.background, 0, 0);
        };
        $scope.ball.onload = function () {
            $scope.ctx.drawImage($scope.ball, $scope.x, $scope.y, $scope.ballHeigh, $scope.ballWidth);
        };

        $scope.init = function () {


            //window.requestAnimationFrame($scope.draw);
        };

        /*document.addEventListener("mousemove", $scope.mouseMoveHandler, false);

         $scope.mouseMoveHandler = function (event) {
         $scope.relativeX = event.clientX - $scope.canvas.offsetLeft;
         if ($scope.relativeX > 0 && $scope.relativeX < $scope.canvas.width) {
         $scope.paddleX = $scope.relativeX - $scope.paddleWidth / 2;
         }
         };*/

        $scope.drawBall = function () {
            $scope.ctx.beginPath();
            $scope.ctx.arc($scope.x, $scope.y, $scope.ballRadius, 0, Math.PI * 2);
            $scope.ctx.fillStyle = "#0095DD";
            $scope.ctx.fill();
            $scope.ctx.closePath();
        };

        /*$scope.drawPaddle = function(){
         $scope.ctx.beginPath();
         $scope.ctx.rect($scope.paddleX, $scope.canvas.height - $scope.paddleHeight, $scope.paddleWidth, $scope.paddleWidth);
         $scope.ctx.fillStyle = "#0095DD";
         $scope.ctx.fill();
         $scope.ctx.closePath();
         };*/

        $scope.draw = function () {
            $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
            $scope.drawBall();
            //$scope.drawPaddle();
            //window.requestAnimationFrame($scope.draw)
        };

        /*$scope.draw();*/
        $scope.init();
































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
        $scope.uCount = 0;

        socket
            .on('initPlayer', function (data) {
                $scope.player.nickname = data.nickName;
                $scope.player.id = data.playerId;
                $scope.player.room = data.roomId;
                $scope.$apply();
                console.log($scope.player);

                $("body").append($scope.player.nickname);

            })
            .emit('initPlayer', $scope.player)
            .emit('addPlayerIntoATable',$scope.player)
            .on('message', function (data) {
                //if(socket.userCount)
                //alert($scope.uCount);
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
            .on('countOfUsers', function(data){
                console.log(data);
            })
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
                        socket.connect();
                    }, 500);
                }
            })
            .on('userCount', function (data) {
                $scope.uCount = data.userCount;
                $scope.$apply();
                console.log(data.userCount);
            })

        //socket.join(socket.roomId);

        $scope.playerId++;
        //})
    })
});
