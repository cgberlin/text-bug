var express = require('express');
var $ = require('jquery');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Account = require('./models/account');
var config = require('./config');


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());



app.use(bodyParser.urlencoded({
    extended: true
}));


var strategy = new LocalStrategy(function(email, password, callback) {
    Account.findOne({
        email: email
    }, function (err, Account) {
        if (err) {
            callback(err);
            return;
        }

        if (!user) {
            return callback(null, false, {
                message: 'Incorrect email.'
            });
        }

        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }

            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return callback(null, user);
        });
    });
});

passport.use(strategy);

app.get('/hidden', passport.authenticate('local', {session: false}), function(req, res) {
    res.json({
        message: 'sucess'
    });
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

    newAccount.save(function(err) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        return res.status(201).json({});
    });
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
