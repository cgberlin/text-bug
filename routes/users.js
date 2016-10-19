var mongoose = require('mongoose');
var Account = require('../models/account');
var CronJob = require('cron').CronJob;
var config = require('../config');
var $ = require('jquery');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

passport.initialize();

passport.use(new Strategy(
  function(username, password, cb) {
    Account.findByUsername(username, function(err, account) {
      if (err) { return cb(err); }
      if (!account) { return cb(null, false); }
      if (account.password != password) { return cb(null, false); }
      return cb(null, account);
    });
  }));

module.exports = {
  createUser : function createUser(req, res) {
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
            }
    }
