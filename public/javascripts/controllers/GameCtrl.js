var app = angular.module('GameApp', ['ui.bootstrap'])
    /*.config(function($routProvider){
        $routeProvider
            .when('/new',{
                templateURL:'winner_modal.ejs'
            })
    })*/

app.controller('GameController',  function ($scope, $location, $uibModal) {

    $scope.draw_id = null;
    $scope.current_game = null;

    $scope.set_player_type = function (form, index) {
        if (!$scope.current_game) {
            return false;
        }
        $scope.type_rb = $('[name="' + form + '"]');
        for (var i = 0; i < $scope.type_rb.length; ++i) {
            if ($scope.type_rb[i].checked) {
                $scope.current_game.set_player_type($scope.type_rb[i].value, index);
            }
        }
    };


    $scope.init = function () {

        $scope.canvas_name = "myCanvas";
        $scope.table = null;

        $scope.set_drawing_context = function () {
            $scope.width = window.innerWidth - 16;
            if ($scope.width < 300) {
                $scope.width = 300;
            }
            $scope.height = $scope.width / 2;

            $scope.canvas_html = "<canvas "
                + " id=" + $scope.canvas_name
                + " width=" + $scope.width
                + " height=" + $scope.height
                + ">Sorry, your browser doesn't appear to support the HTML-5 Canvas</canvas>";

            $('#pool_table').html($scope.canvas_html);

            $scope.canvas = document.getElementById($scope.canvas_name);
            if (!$scope.canvas) {
                return false;
            }
            $scope.ctx = $scope.canvas.getContext("2d");
            if (!$scope.ctx) {
                return false;
            }

            if (!$scope.table) {
                $scope.table = new Table();
                $scope.table.initialize(game);
            }

            $scope.ctx.translate($scope.width / 2, $scope.height / 2);
            $scope.ctx.scale($scope.height * table_scale, $scope.height * table_scale);

            $scope.table.ctx = $scope.ctx;

            $scope.canvas_offset = new Vector(
                $scope.canvas.offsetLeft + $scope.width / 2,
                $scope.canvas.offsetTop + $scope.height / 2
            );

            $scope.mouse_vec = function (e) {
                $scope.vec = new Vector(e.clientX + window.scrollX, e.clientY + window.scrollY);
                $scope.vec.subtract($scope.canvas_offset);
                $scope.vec.scale_down($scope.height * table_scale);
                return $scope.vec;
            };

            $scope.mouse_down = function (e) {
                e.preventDefault();
                $scope.table.player().mouse_down($scope.mouse_vec(e));
            };

            $scope.mouse_up = function (e) {
                e.preventDefault();
                $scope.table.player().mouse_up($scope.mouse_vec(e));
            };

            $scope.mouse_move = function (e) {
                e.preventDefault();
                $scope.table.player().mouse_move($scope.mouse_vec(e));
            };

            $scope.canvas.addEventListener('touchstart', $scope.mouse_down, false);
            $scope.canvas.addEventListener('touchend', $scope.mouse_up, false);
            $scope.canvas.addEventListener('touchmove', $scope.mouse_move, false);
            $scope.canvas.addEventListener('mousedown', $scope.mouse_down, false);
            $scope.canvas.addEventListener('mouseup', $scope.mouse_up, false);
            $scope.canvas.addEventListener('mousemove', $scope.mouse_move, false);
        };

        $scope.set_drawing_context();

        if ($scope.table) {
            window.onresize = $scope.set_drawing_context;
        }


        $scope.draw_fn = function () {
            $scope.table.draw();
            if ($scope.current_game != $scope.table.game) {
                $scope.current_game = $scope.table.game;
                $scope.set_player_type("player1_type", 0);
                $scope.set_player_type("player2_type", 1);
            }
            if ($scope.table.is_stable() && $scope.table.update_id != null) {
                clearInterval($scope.table.update_id);
                $scope.table.update_id = null;
                $scope.table.game.shot_complete();
                $scope.table.player().begin_shot();
            }
        };

        if ($scope.draw_id == null) {
            $scope.draw_id = setInterval($scope.draw_fn, 50);
        }

    };


    $scope.declareWinner = function () {
        /*Game.incrementTarget();
         Game.shufflePlayers();*/
        //$location.path('/new');
        $uibModal.open({


            controller: function($scope){alert('lol')},
            templateUrl: '/tables',
            resolve: {
                winner: function(){
                    return $scope.player;
                }
            }
        });
    };


    var socket = io.connect('/', {
        reconnect: false
    });

    $scope.player = {
        nickname: "",
        turn: "",
        room: "",
        photo: null
    };

    console.info("path %s", $location.absUrl().split('/').pop());




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
        .emit('joinGameRoom', {'roomName': $location.absUrl().split('/').pop()})
        .on('lol', function (data) {
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
            /*$scope.loadUser = function(){
                this.directive('userInfo', function(){
                    return {
                        link: function($scope,element,attrs){
                            element.html("<div>{{")
                        }
                    }
                })
            }*/

            console.log(data.user);
            $scope.player.nickname = data.user.profile.nickname;
            $scope.player.turn = 'X';
            $scope.player.room = $location.absUrl().split('/').pop();
            $scope.player.photo = data.user.profile.photo.data;
            console.log(data.user.profile.photo);
            $scope.$apply();
            //$('div.info').append($scope.player.nickname);
            //$('div.info span').append($scope.player.turn);
            console.log('player ', $scope.player);













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
        .on('leave', function (opponentName) {
            alert(opponentName + " has gone")
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
})

