const mongoose = require('mongoose');
const User = require('./user');
const _ = require('lodash');

var mapSchema = new mongoose.Schema({
    room: {
        type: String,
        index: true
    },
    status: String,
    numPlayers: Number,
    players: [User,{_id: false}]
    /*id: Number,
    createdAt: Date,
    players: []*/
});

mapSchema.methods.reset = function(){
    _.map(this.players, function(player){
        player.reset();
    });
    this.players = [];
};

mapSchema.methods.addPlayer = function(player){
    this.players.push(player);
};

mapSchema.methods.removePlayer = function(player){
    this.players.splice(this.players.indexOf(player), 1);
};
module.exports = mongoose.model('Map',mapSchema);