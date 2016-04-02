var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({

    local: {
        nickname: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
        password: {
            type: String,
            default: ''
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        points: {
            type: Number,
            default: 0
        },
        cash: {
            type: Number,
            default: 0
        }
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }

});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);