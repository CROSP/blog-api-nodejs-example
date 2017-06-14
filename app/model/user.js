/**
 * Created by crosp on 5/8/17.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const crypto = require('crypto');
let UserSchema = new Schema({
    firstName: String,
    lastName: String,
    salt: {
        type: String,
        required: true
    },
    isActive: {type: Boolean, default: true},
    dateCreated: {type: Date, default: Date.now},
    email: String,
    hashedPassword: {
        type: String,
        required: true,
    },
});
UserSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.hashedPassword;
    delete obj.__v;
    delete obj.salt;
    return obj
};

UserSchema.virtual('id')
    .get(function () {
        return this._id;
    });
UserSchema.virtual('password')
    .set(function (password) {
        this.salt = crypto.randomBytes(32).toString('base64');
        this.hashedPassword = this.encryptPassword(password, this.salt);
    })
    .get(function () {
        return this.hashedPassword;
    });

UserSchema.methods.encryptPassword = function (password, salt) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
};
UserSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password, this.salt) === this.hashedPassword;
};
module.exports.UserModel = mongoose.model('User', UserSchema);