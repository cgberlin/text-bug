var account = '';

var pages = {
  mainAccountPanel : $('.main-account-panel'),
  signUpPage : $('.sign-up-container'),
  pendingMessagePage : $('.pending-message-container'),
  newMessagePage : $('.new-message-container'),
  contactPage : $('.contact-page-container'),
  inlineContactForm : $('#inline-contact-add-form')
};
$( function() {
  $( "#datepicker" ).datepicker();
});

$('#new-message-create-contact').on('click', function(){  //listener for the button to bring up the inline contact add form
  pages.inlineContactForm.show();
});

$('#submit-new-contact').on('click', function(){  //listener for button on the inline contact form that is accessed through new message
  updateContact($('#add-contact-name').val(),  $('#add-contact-number').val());
});

$('#submit-new-contact-inline').on('click', function(){
  pages.inlineContactForm.hide();
  updateContact($('#add-contact-name-inline').val(), $('#add-contact-number-inline').val());
});

function updateContact(nameSubmit, numberSubmit){
  $('#list-of-contacts').append('<p class = "contacts" id = "'+nameSubmit+'">'+ nameSubmit + ' : '+ numberSubmit +' ' +'<button type = "button" class = "btn btn-warning">Remove</button></p>');
  var body = {
    username : account,
    contact : {
      name : nameSubmit,
      number : numberSubmit
    }
  }
  $.ajax({
        url : '/update',
        data : body,
        type : 'PUT'
    });
}

function updateContactPage(body){
  $.get('/contacts', body)
                      .done(function(contacts){
                        for (var i = 0; i < contacts.length; i++){
                          $('#list-of-contacts').append('<p class = "contacts" id = "'+contacts[i].name+'">'+ contacts[i].name + ' : '+ contacts[i].number +' ' + '<button type = "button" class = "btn btn-warning">Remove</button></p>');
                        }
                      });
}
$('#create-new-message-button').on('click', function(){
  pages.mainAccountPanel.hide();
  pages.newMessagePage.show();
});

$('#contacts-button').on('click', function(){
  $('#list-of-contacts').empty();
  pages.pendingMessagePage.hide();
  pages.mainAccountPanel.hide();
  pages.contactPage.show();
  var body = {
    username : account
  }
  updateContactPage(body);
});

$('#submit-new-message').on('click', function(){
  var body = {
    username : account,
    messageName : $('#message-name').val(),
    date : $('#datepicker').val(),
    time : $('#new-message-time').val(),
    messageText : $('#message-body').val(),
    contact : $('#contact-name-new-message').val()
  }
  $.post('/create-message', body);
  returnMainPage();
});

$('#view-pending-button').on('click', function(){
  pages.mainAccountPanel.hide();
  pages.pendingMessagePage.show();
  $('#list-of-messages').empty();
  var body = {
    username : account
  }
  $.get('/messages', body)
      .done(function(pendingMessages){
        for (var length = pendingMessages.length,  i = 0; i < length; i++){
          $('#list-of-messages').append('<div class ="pending-message"><p>Name:'+' '+pendingMessages[i].messageName+
                                                        ' '+'-------'+' '+'Date:'+' '+pendingMessages[i].date);
        }
      });
});

$('.contact-page-container').on('click', '.btn-warning', function(){
    var contactToRemove = $(this).parent().prop('id');
    console.log($(this).parent().prop('id'));
    var body = {
      username : account,
      name : contactToRemove
    }
    $.ajax({
      url : '/remove',
      data : body,
      type : 'DELETE'
  });
    $(this).parent().remove();
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
                                pages.mainAccountPanel.show();
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
  pages.pendingMessagePage.hide();
  $('.main-page-container').hide()
  pages.signUpPage.show();
});
$('#brand').on('click', function(){
  if (account != ''){
    returnMainPage();
  }
});

function returnMainPage(){
    pages.signUpPage.hide();
    pages.inlineContactForm.hide();
    pages.pendingMessagePage.hide();
    pages.newMessagePage.hide();
    pages.contactPage.hide();
    pages.mainAccountPanel.show();
}
