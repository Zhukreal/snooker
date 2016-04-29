var app = angular.module('GameApp', []);

app.controller('GameController', function ($scope, $log) {
    $(document).ready(function () {

        $scope.canvas = document.getElementById("myCanvas");
        $scope.ctx = $scope.canvas.getContext("2d");

        $scope.canvas.width = 1400;
        $scope.canvas.height = 700;

        $scope.background = new Image();
        $scope.ball = document.createElement('img');
        $scope.ball.setAttribute('src', '../images/_ball.png');
        $scope.ball.setAttribute('id', 'ball');
        $scope.ball.style.top="390px";
        $scope.ball.style.left="490px";
        document.getElementById("snooker").appendChild($scope.ball);

        $scope.cue = document.createElement('img');
        $scope.cue.setAttribute('src', '../images/cue-0.png');
        $scope.cue.setAttribute('id', 'cue');
        $scope.cue.style.top="390px";
        $scope.cue.style.left="490px";
        $scope.cue.style.width="900px";
        $scope.cue.style.height="20px";
        $scope.cue.style.position ="absolute";
        
        document.getElementById("snooker").appendChild($scope.cue);
        

        $scope.background.src = "../images/playerTable.png";
        /*$scope.ball.src = '../images/_ball.png';*/
        
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
        /*
        $scope.ball.onload = function () {
            $scope.ctx.drawImage($scope.ball, $scope.x, $scope.y, $scope.ballHeigh, $scope.ballWidth);
        };
*/
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

        var drawBall = function () {
            $scope.ctx.beginPath();
            $scope.ctx.arc($scope.x, $scope.y, $scope.ballRadius, 0, Math.PI * 2);
            $scope.ctx.fillStyle = "#0095DD";
            $scope.ctx.fill();
            $scope.ctx.closePath();
        };
/*
        $scope.drawCue = function() {
            $scope.ctx.beginPath();
            $scope.ctx.;
            $scope.ctx.fillStyle = "#0095DD";
            $scope.ctx.fill();
            $scope.ctx.closePath();  
        }*/

        /*$scope.drawPaddle = function(){
         $scope.ctx.beginPath();
         $scope.ctx.rect($scope.paddleX, $scope.canvas.height - $scope.paddleHeight, $scope.paddleWidth, $scope.paddleWidth);
         $scope.ctx.fillStyle = "#0095DD";
         $scope.ctx.fill();
         $scope.ctx.closePath();
         };*/

        $scope.draw = function () {
            $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
            //$scope.drawBall();
            //$scope.drawPaddle();
            //window.requestAnimationFrame($scope.draw)
        };

        /*$scope.draw();*/
        $scope.init();

        $scope.canvas.onclick = function(e) {
            console.log(e);
        }




        var canvas=$scope.canvas;
        console.log(canvas.style);
        function getCoords(elem) {

          var box = elem.getBoundingClientRect();

          var body = document.body;
          var docEl = document.documentElement;

          var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
          var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

          var clientTop = docEl.clientTop || body.clientTop || 0;
          var clientLeft = docEl.clientLeft || body.clientLeft || 0;

          var top = box.top + scrollTop - clientTop;
          var left = box.left + scrollLeft - clientLeft;

          return {
            top: parseInt(top),
            left: parseInt(left)
          };
        }
        

        $scope.rotateCue = function(e) {
            var canvasCoords = getCoords($scope.canvas);

            var ballCoords = getCoords($scope.ball);

            var x = e.pageX - canvasCoords.left;
            var y = e.pageY - canvasCoords.top;
            console.log('X: ', x, 'Y: ', y);

            
            var ballX = ballCoords.left;
            var ballY = ballCoords.top; 
            var alpha = Math.atan( (ballY - y)/(ballX - x) );

            $scope.cue.style.transform = 'rotate(' + (-alpha*57) + 'deg)';

            //console.log(ballX);
            $scope.cue.style.left = (ballX-430) + 'px'; 
            $scope.cue.style.top = ballY + 'px';
            //console.log($scope.cue.style.left);
/*
            console.log('ballCoords', {x: ballX, y: ballY});
            console.log('x ang y', {x: x, y: y} );
            console.log('cue coords', { x: $scope.cue.style.left, y: $scope.cue.style.top } );*/
            /*var transform = 'rotate(75 deg)';
            $scope.cue.style.webkitTransform = transform;
            $scope.cue.style.mozTransform = transform;
            $scope.cue.style.msTransform = transform;
            $scope.cue.style.oTransform = transform;*/
        }

        var ball = $scope.ball;
        var ballCoords = getCoords($scope.ball);
        var ballX = ballCoords.left;
        var ballY = ballCoords.top; 
        $scope.cue.style.left = (ballX-430) + 'px'; 
        $scope.cue.style.top = (ballY) + 'px';

        ball.onmousedown = function(e) { // 1. отследить нажатие
            ball.style.position = 'absolute';
            moveAt(e);
            document.getElementById("snooker").appendChild(ball);
            ball.style.zIndex = 1000; 
            function moveAt(e) {

                if ((e.pageX - ball.offsetWidth / 2) > 387 && (e.pageX - ball.offsetWidth / 2) < 1599 && (e.pageY - ball.offsetHeight / 2) > 129 && (e.pageY - ball.offsetHeight / 2) < 647 ) {
                    ball.style.left = e.pageX - ball.offsetWidth / 2 + 'px';
                    ball.style.top = e.pageY - ball.offsetHeight / 2 + 'px';

                    //console.log('Canvas: ');
                    //console.log('X : ', , 'Y : ', );
                    //console.log('Ball: ');
                    //console.log('X : ', ball.style.left, 'Y : ', ball.style.top);
                }
            }

            document.onmousemove = function(e) {
                $scope.cue.style.display = "none";
                moveAt(e);
            }

            ball.onmouseup = function() {
                console.log('Ball onmouse up');
                document.onmousemove = null;
                ball.onmouseup = null;
                $scope.cue.style.display = "block";
                

                var ballCoords = getCoords($scope.ball);
                var ballX = ballCoords.left;
                var ballY = ballCoords.top; 
                $scope.cue.style.left = (ballX-450) + 'px'; 
                $scope.cue.style.top = (ballY-20) + 'px';

                document.onmousemove = $scope.rotateCue;
            }
        }

        ball.ondragstart = function() {
            return false;
        }




        document.onmousemove = $scope.rotateCue;




















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
                //$scope.$emit('error');
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
