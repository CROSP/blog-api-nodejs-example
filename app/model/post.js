/**
 * Created by crosp on 5/8/17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let BlogPostSchema = new Schema({
    title: String,
    content: String,
    authorId: {
        type: ObjectId,
        required: true
    },
    dateCreated: {type: Date, default: Date.now},
    dateModified: {type: Date, default: Date.now},
});
BlogPostSchema.pre('update', function (next, done) {
    this.dateModified = Date.now();
    next();
});
BlogPostSchema.pre('save', function (next, done) {
    this.dateModified = Date.now();
    next();
});
BlogPostSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.__v;
    return obj
};
module.exports.BlogPostModel = mongoose.model('Post', BlogPostSchema);
