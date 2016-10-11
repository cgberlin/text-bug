var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    username: String,
    email: String,
    password: String
 });

var Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
