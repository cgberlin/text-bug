function findUserAccountToSaveContact(Username){
  Account.findByUsername(Username, function(err, account){
    if (err) { return res.status(500).json({
        message: 'Internal server error'
              });
            }
    if (!account) { return res.json({
      message: 'no account specified'
          });
        }
      });
    account.contacts.push(req.body.contact);
    account.save(function(){
          console.log('account saved');
        });
}

module.exports = {
  findUserAccountToSaveContact() {}
}
