var account = '';


$( function() {
  $( "#datepicker" ).datepicker();
} );

$('#new-message-create-contact').on('click', function(){  //listener for the button to bring up the inline contact add form
  $('#inline-contact-add-form').show();
});

$('#submit-new-contact').on('click', function(){  //listener for button on the inline contact form that is accessed through new message

  updateContact($('#add-contact-name').val(),  $('#add-contact-number').val());
});

$('#submit-new-contact-inline').on('click', function(){
  $('#inline-contact-add-form').hide();
  updateContact($('#add-contact-name-inline').val(), $('#add-contact-number-inline').val());
});

function updateContact(nameSubmit, numberSubmit){
  var body = {
    username : account,
    contact : {
      name : nameSubmit,
      number : numberSubmit
    }
  }
  $.post('/update', body)
        .done(function(response){
          console.log(response);
        });
}

$('#create-new-message-button').on('click', function(){
  $('.main-account-panel').hide();
  $('.new-message-container').show();
});

$('#contacts-button').on('click', function(){
  $('.main-account-panel').hide();
  $('.contact-page-container').show();
  var body = {
    username : account
  }
  $.get('/contacts', body)
                      .done(function(contacts){
                        for (var i = 0; i < contacts.length; i++){
                          console.log(contacts[i].name);
                          $('#contacts-header-title').append('<p class = "contacts">'+ contacts[i].name + ' : '+ contacts[i].number +'<button id = "remove-contact" type = "button" class = "btn btn-danger">Remove</button></p>')
                        }
                      });
});

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
                                $('#login-form').hide();
                                account = credentials.username;
                              });
  });

$('#account-create-button').on('click', function(){  //handler for account creation
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
      $('.sign-up-container').hide();
      $('.main-page-container').show();
    }
  else {
    alert('passwords dont match');
  }
});

$('#sign-up').on('click', function(){
  $('.main-page-container').hide()
  $('.sign-up-container').show();
});

$('#brand').on('click', function(){
  if (account != ''){
    $('.sign-up-container').hide();
    $('#inline-contact-add-form').hide();
    $('.new-message-container').hide();
    $('.contact-page-container').hide();
    $('.main-account-panel').show();
  }

});
