/**
 * Created by crosp on 5/8/17.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RevokedTokenScheme = new Schema({
    token: String,
    date: {type: Date, default: Date.now}
});
module.exports.RevokedTokenModel = mongoose.model('RevokedToken', RevokedTokenScheme);