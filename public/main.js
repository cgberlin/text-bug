$('#login-form-login').on('click', function(){
  var email = $('#email-login').val();
  var password = $('#password-login').val();
  $.get('/hidden', {email: email, password: password})
        .done(function(){
          console.log('tested for login');
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
      console.log(credentials);
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
