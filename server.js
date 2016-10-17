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

var passport = require('passport');
var Strategy = require('passport-local').Strategy;




app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(passport.initialize());

passport.use(new Strategy(
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


app.post('/hidden', passport.authenticate('local'), function(req, res) {
  res.json('yes');
});



app.post('/users', function(req, res) {
    <!--account creation-->

    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    if (!('email' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: email'
        });
    }

    var email = req.body.email;

    if (typeof email !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: email'
        });
    }

    email = email.trim();

    if (email === '') {
        return res.status(422).json({
            message: 'Incorrect field length: email'
        });
    }

    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    var newAccount = new Account({
        username: email,
        email: email,
        password: password
    });
    passport.authenticate('local');
    newAccount.save(function(err) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        return res.status(201).json({});
    });
});

app.put('/update', function(req, res){
  Account.findByUsername(req.body.username, function(err, account){
    if (err) { return res.status(500).json({
        message: 'Internal server error'
    });
  }
    if (!account) { return res.json({
      message: 'no account specified'
    });
   }
    account.contacts.push(req.body.contact);
    account.save(function(){
          console.log('account saved');
        });
  });
});

app.delete('/remove', function(req, res){
  Account.findByUsername(req.body.username, function(err, account){
    if (err) { return res.status(500).json({
        message: 'Internal server error'
    });
  }
    if (!account) { return res.json({
      message: 'no account found'
    });
   }
   var contactToRemove = req.body.name;
   for (i = 0; i < account.contacts.length; i++){
     if (account.contacts[i].name == contactToRemove){
       account.contacts.splice(i, 1);
       account.save();
       console.log(account.contacts);
     }
   }
  });
});

app.get('/contacts', function(req, res){
  Account.findByUsername(req.query.username, function(err, account){
    if (err) { return res.status(500).json({
        message: 'Internal server error'
    });
  }
    if (!account) { return res.json({
      message: 'no account specified'
    });
   }
      var contacts = account.contacts;
      return res.json(contacts);
  });
});

app.get('/messages', function(req, res){
  console.log(req.query.username);
  Account.findByUsername(req.query.username, function(err, account){
    if (err) { return res.status(500).json({
        message: 'Internal server error'
    });
  }
    if (!account) { return res.json({
      message: 'no account specified'
    });
   }
      var pendingMessages = account.pendingMessages;
      return res.json(pendingMessages);
  });
});

app.post('/create-message', function(req, res){
  var contactNumber;
  Account.findByUsername(req.body.username, function(err, account){
    if (err) { return res.status(500).json({
        message: 'Internal server error'
    });
  }
    if (!account) { return res.json({
      message: 'no account specified'
    });
   }
    account.pendingMessages.push(req.body);
    account.save();
    for (var length = account.contacts.length, i = 0; i<length; i++){
      if (account.contacts[i].name == req.body.contact){
          contactNumber = account.contacts[i].number;
      }
    }
  });
  var suppliedTime = req.body.time.toString();
  var time = suppliedTime.split(':');
  var hour = time[0];
  var minute = time[1];
  var date = new Date(req.body.date);
  var cronDate = ('00'+' '+minute+ ' '+hour+' '+ date.getDate() + ' ' + date.getMonth() + ' ' +'*');
  console.log(cronDate);
  var job = new CronJob({
  cronTime: cronDate,
  onTick: function() {
    console.log('message out!');
    sinchSms.sendMessage("+1"+contactNumber, req.body.messageText);
          },
          start: false,
          timeZone: 'America/Los_Angeles'
        });
        job.start();
        });

var runServer = function(callback) {
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
