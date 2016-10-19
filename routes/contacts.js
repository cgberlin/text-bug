var mongoose = require('mongoose');
var Account = require('../models/account');

module.exports = {
  findUserAndSaveContact : function saveContact(req) {
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
                                        });
                                      });
                                    },
  deleteContact : function deleteContact(req){
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
                                 }
                               }
                              });
                            },
  getContacts : function getContacts(req, res){
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
                        }
}
