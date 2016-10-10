var mongoose = require('mongoose');

var AccountSchema = mongoose.Schema({
    email: {type: String, unique: true, required:true},
    password: {type: String, required: true}
 });

 var Account = mongoose.model('Account', accountSchema);

module.exports = Item;
