const util = ('util');
const EventEmitter = require('events').EventEmitter;
const mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
    user: Number

})