var accountReal;




$('#login-form-login').on('click', function(){
  var emailName = $('#email-login').val();
  var passwordName = $('#password-login').val();
  var credentials = {
    username : emailName,
    password : passwordName
  };
  var accountReal = $.post('/hidden', credentials)
                      .done(function(){
                                $('.main-page-container').hide();
                                $('.main-account-panel').show();
                              });
  });

$('#account-create-button').on('click', function(){
  var emailName = $('#sign-up-email').val();
  var passwordName = $('#sign-up-password').val();
  var passwordVerify = $('#sign-up-password-verify').val();
  if (passwordName === passwordVerify){
      var credentials = {
        email : emailName,
        password : passwordName
      };
      $.post('/users', credentials)
          .done(console.log('success'));
    }
  else {
    alert('passwords dont match');
  }
});

$('#sign-up').on('click', function(){
  $('.main-page-container').hide()
  $('.sign-up-container').show();
});
