var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    local: {
        nickname: {
            type: String,
            default: '',
            unique: true,
            required: true
        },
        email: {
            type: String,
            //default: '',
            index: true,
            match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
        },
        password: {
            type: String,
            //default: '',
            validate: [
                function (password) {
                    return password.length >= 4;
                },
                'Password should be longer'
            ]
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
        },
        userState: {
            type: String,
            default: ""
        }
        /*userState: {
         type: String,
         enum: ["waiting", "ready", "playing", "finished"],
         default: ""
         }*/
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

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.joinMap = function (map) {
    this.timeStamp = new Date().getDate();
    this.mapId = map.id;
};
userSchema.methods.wait = function () {
    this.userState = "waiting";
};

module.exports = mongoose.model('User', userSchema);