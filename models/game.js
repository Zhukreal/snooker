//const util = ('util');
//const EventEmitter = require('events').EventEmitter;
const mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
    gameId: Number,
    playerOneNickname : String,
    playerTwoNickname: String,
    turn:{
        type: Number,
        default:0
    },
    status: String
});

module.exports = mongoose.model('GameItem', GameSchema);