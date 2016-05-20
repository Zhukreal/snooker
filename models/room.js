const mongoose = require('mongoose');
var user = require('./user');

var roomSchema = new mongoose.Schema({
    name: String,
    maxPlayers: Number,
    playerCount: {
        type: Number,
        default: 0
    },
    players: [/*user*/mongoose.Schema.Types.Mixed],
    roomState: {
        type: String/*,
        enum: ["incomplete", "complete"]*/
    }
});

roomSchema.method.incomplete = function () {
    this.roomState = "incomplete";
};

roomSchema.method.isIncomplete = function () {
    return (this.roomState == "incomplete");
};

roomSchema.method.complete = function () {
    this.roomState = "complete";
};

roomSchema.method.isComplete = function () {
    return (this.roomState == "complete");
};

module.exports = mongoose.model('Room', roomSchema);