var mongoose = require('mongoose');

var AccountSchema = mongoose.Schema({
    email: String,
    password: String
 });

 var Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
