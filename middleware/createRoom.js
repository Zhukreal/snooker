const session = require('express-session');
var Room = require('../models/room');

module.exports = function (req, res, next) {

    Room.findOne({name: req.params.id}, function (err, room) {
        if (err)
            next(err);
        if (room) {
            room.players.push(req.user._id);
            room.playerCount++;
            room.ready();
            room.save(function (err) {
                if (err)
                    throw err;
            });
        }
        else {
            var newRoom = new Room({
                name: req.params.id,
                maxPlayers: 2
            });

            newRoom.players.push(req.user._id);
            //newRoom.update({name: req.params.id}, {$push: {players: req.user}});
            newRoom.playerCount++;
            newRoom.save(function (err) {
                if (err)
                    throw err;
                console.log("room has been created successfully");
            });
        }
    });
    next();
};