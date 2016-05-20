const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const validator = require('validator');

var userSchema = new mongoose.Schema({
    local: {
        email: {
            type: String,
            required: true,
            default:"",
            unique: false,
            //index: true,
            match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
        },
        password: {
            type: String,
            required: true,
            validate: [
                function (password) {
                    return password.length >= 4;
                },
                'Password should be longer'
            ]
        },
        createdAt:{
            type: Date,
            default: Date.now
        },
        userState: {
            type: String,
            default: ""
        }
    },
    profile:{
        nickname: {
            type: String,
            default: "",
            //unique: true,
            required: true
        },
        location:{
            type: String,
            default:''
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
    }
    /*,
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
     }*/

});

userSchema.path('local.email').validate(function (email) {
    return validator.isEmail(email);
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.pre('update', function () {
    this.update({}, {$set: {updatedAt: new Date()}});
});

userSchema.methods.wait = function () {
    this.local.userState = "waiting";
};

module.exports = mongoose.model('User', userSchema);