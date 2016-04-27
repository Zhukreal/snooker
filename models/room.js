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
        type: String,
        enum: ["waiting", "ready", "playing", "finished"],
        default: "waiting"
    }
});

roomSchema.methods.wait = function () {
    this.roomState = "waiting";
};
roomSchema.methods.isWaiting = function () {
    return (this.roomState == "waiting")
};
roomSchema.methods.ready = function () {
    this.roomState = "ready";
};
roomSchema.methods.isReady = function () {
    return (this.roomState == "ready")
};
roomSchema.methods.play = function () {
    this.roomState = "playing";
};
roomSchema.methods.isPlaying = function () {
    return (this.roomState == "playing")
};
roomSchema.methods.finish = function () {
    this.roomState = "finished";
};
roomSchema.methods.isFinished = function () {
    return (this.roomState == "finished")
};

module.exports = mongoose.model('Room', roomSchema);