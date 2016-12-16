var mongoose = require('mongoose');
var Account = require('../models/account');
var CronJob = require('cron').CronJob;
var config = require('../config');
var sinchAuth = require('sinch-auth');
var SinchClient = require('sinch-rtc');
var sinchClient = new SinchClient({
    applicationKey: '67a8370a-9a36-40c6-a114-a2d63f598000',
    capabilities: {messaging: true, calling:true},
});
var sinchSms = require('sinch-messaging');
var auth = sinchAuth("67a8370a-9a36-40c6-a114-a2d63f598000", "0Ns0QdjDZUmNLSqrRs/jpw==");
var $ = require('jquery');

module.exports = {
  pendingMessages : function pendingMessages(req, res){
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
          },
  newInstantMessage : function newInstantMessage(req, res) {
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
                  sinchSms.sendMessage("+1" + contactNumber, req.body.messageText);
              }
            }
          });
            res.send('sent message');
          },
  newMessage : function newMessage(req, res){
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
          var job = new CronJob({
          cronTime: cronDate,
          onTick: function() {
            sinchSms.sendMessage("+1"+contactNumber, req.body.messageText);
                  },
                  start: false,
                  timeZone: 'America/Los_Angeles'
                });
                job.start();
              res.send('created message');
            },
          newCall : function newCall(req, res){
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
          var job = new CronJob({
          cronTime: cronDate,
          onTick: function() {
            var callListeners = {
                    onCallEstablished: function(call) {
                        $('audio').attr('src', call.incomingStreamURL); //If audio element has attribute "autoplay"
                    },
                }
            var call = callClient.callPhoneNumber('+1'+contactNumber, req.body.messageText);
            call.addEventListener(callListeners);
                  },
                  start: false,
                  timeZone: 'America/Los_Angeles'
                });
                job.start();
              res.send('created call');
    }
}
