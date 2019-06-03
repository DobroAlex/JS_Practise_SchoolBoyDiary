var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    FL: String,
    description: String
});
var User = mongoose.model("User", UserSchema);
module.exports = User;