var mongoose = require('mongoose');
var Account = require('../models/account');
var CronJob = require('cron').CronJob;
var config = require('../config');
var sinchAuth = require('sinch-auth');
var sinchSms = require('sinch-messaging');
var auth = sinchAuth("67a8370a-9a36-40c6-a114-a2d63f598000", "0Ns0QdjDZUmNLSqrRs/jpw==");
var $ = require('jquery');


module.exports = {
  pendingMessages : function pendingMessages(req, res){
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
              res.send('created message');
        }

}
