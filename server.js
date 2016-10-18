var express = require('express');
var $ = require('jquery');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Account = require('./models/account');
var CronJob = require('cron').CronJob;
var config = require('./config');
var sinchAuth = require('sinch-auth');
var sinchSms = require('sinch-messaging');
var auth = sinchAuth("67a8370a-9a36-40c6-a114-a2d63f598000", "0Ns0QdjDZUmNLSqrRs/jpw==");
var contactFunctions = require('./routes/contacts');
var messageFunctions = require('./routes/messages');
var userFunctions = require('./routes/users');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(passport.initialize());

passport.use(new Strategy(    //passport strategy for authentication
  function(username, password, cb) {
    Account.findByUsername(username, function(err, account) {
      if (err) { return cb(err); }
      if (!account) { return cb(null, false); }
      if (account.password != password) { return cb(null, false); }
      return cb(null, account);
    });
  }));

passport.serializeUser(function(account, cb) {
    cb(null, account.id);
  });

passport.deserializeUser(function(id, cb) {
    Account.findById(id, function (err, account) {
      if (err) { return cb(err); }
      cb(null, account);
    });
  });

app.post('/hidden', passport.authenticate('local'), function(req, res) {    //authenticates users with passport
  res.json('yes');
});
app.post('/users', function(req, res) {   //creates a new user
    userFunctions.createUser(req, res);
});

app.put('/update', function(req, res){      //adds a contact
  contactFunctions.findUserAndSaveContact(req);
});

app.delete('/remove', function(req, res){   //removes a contact
  contactFunctions.deleteContact(req);
});

app.get('/contacts', function(req, res){   //gets list of contacts
  contactFunctions.getContacts(req, res);
});

app.get('/messages', function(req, res){   //gets list of messages
  messageFunctions.pendingMessages(req, res);
});

app.post('/create-message', function(req, res){  //creates a new message
  messageFunctions.newMessage(req, res);
});

var runServer = function(callback) {    //connects to the mongodb
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

exports.app = app;
exports.runServer = runServer;
app.use(express.static('public'));
