const uuid = require('node-uuid');

var Game = function(io){

    var gameId = uuid.v4();
    var playerCount = 0;

    var connectPlayer = function(socket){
        attachSocket(socket);
        socket.emit('gameJoined',{
            room: gameId,
            numPlayers: playerCount
        });
        socket.broadcast.to(gameId).emit('playerJoined',{numPlayers: playerCount})
    }

    var attachSocket = function(socket){
        socket
            .join(gameId)
            //.on()
    }

};
module.exports = Game;