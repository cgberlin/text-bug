var account = '';        // variable to store the account name
var pages = {           // object containing references to each container element
  mainAccountPanel : $('#main-panel'),
  rightAccountPanel : $('.main-account-right-panel'),
  leftAccountPanel : $('.main-account-left-panel'),
  signUpPage : $('.sign-up-container'),
  pendingMessagePage : $('.pending-message-container'),
  newMessagePage : $('.new-message-container'),
  contactPage : $('.contact-page-container'),
  inlineContactForm : $('#inline-contact-add-form')
};
$( function() {          //initializes the datepicker
  $( "#datepicker" ).datepicker();
});
$('#new-message-create-contact').on('click', function(){  //listener for the button to bring up the inline contact add form
  pages.inlineContactForm.show();
});
$('#submit-new-contact').on('click', function(){  //listener for button on the inline contact form that is accessed through new message
  var numberWithNoHyphens = $('#add-contact-number').val().replace(/[^0-9.]/g, '');
  numberWithNoHyphens = numberWithNoHyphens.slice(1);
  updateContact($('#add-contact-name').val(), numberWithNoHyphens);
});
$('#submit-new-contact-inline').on('click', function(){     //listener for new contact inline form submit
  pages.inlineContactForm.hide();
  var numberWithNoHyphens = $('#add-contact-number-inline').val().replace(/[^0-9.]/g, '');
  numberWithNoHyphens = numberWithNoHyphens.slice(1);
  $('#contact-name-new-message').val($('#add-contact-name-inline').val());
  updateContact($('#add-contact-name-inline').val(), numberWithNoHyphens);      //updates the contact list
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
  $.ajax({       //call to send the new contact to the server
        url : '/update',
        data : body,
        type : 'PUT'
    });
}

$(document).mouseup(function (e)
{
    var container = $("#add-contact-form");
    if (!container.is(e.target) 
        && container.has(e.target).length === 0) 
    {
        pages.inlineContactForm.hide();
    }
});


function updateContactPage(body){
  $.get('/contacts', body)       //call to update the contact list when contact container is loaded
                      .done(function(contacts){
                        for (var i = 0; i < contacts.length; i++){
                          $('#list-of-contacts').append('<p class = "contacts" id = "'+contacts[i].name+'">'+ contacts[i].name + ' : '+ contacts[i].number +' ' + '<button type = "button" class = "btn btn-warning">Remove</button></p>');
                        }
                      });
                    }
$('#create-new-message-button').on('click', function(){     //listener to bring up new message panel from main page
  pages.mainAccountPanel.hide();
  pages.newMessagePage.show();
  });

$('#contacts-button').on('click', function(){      // listenter to open the contact container
  $('#list-of-contacts').empty();
  pages.pendingMessagePage.hide();
  pages.mainAccountPanel.hide();
  pages.contactPage.show();
  var body = {
    username : account
    }
  updateContactPage(body);
  });

$('#submit-new-message').on('click', function(){      //listener for new message submit button
  newMessageOrCall('/create-message');      //calls the server with the info needed to create the new message
  });
$('#submit-new-call-button').on('click', function(){
  newMessageOrCall('/create-call');      //calls the server with the info needed to create the new message
});
$('#view-pending-button').on('click', function(){    //brings up the pending messages panel
  pages.mainAccountPanel.hide();
  pages.pendingMessagePage.show();
  $('#list-of-messages').empty();
  var body = {
    username : account
  }
  $.get('/messages', body)    //call to retrieve the list of sent messages, then appends to the page
      .done(function(pendingMessages){
        for (var length = pendingMessages.length,  i = 0; i < length; i++){
          $('#list-of-messages').append('<div class ="pending-message"><p>Name:'+' '+pendingMessages[i].messageName+
                                                        ' '+'-------'+' '+'Date:'+' '+pendingMessages[i].date);
                                                      }
                                                    });
                                                  });

$('.contact-page-container').on('click', '.btn-warning', function(){   //listener for the remove buttons on contacts
    var contactToRemove = $(this).parent().prop('id');
    var body = {
      username : account,
      name : contactToRemove
      }
    $.ajax({      //makes the call to the server to remove the contact
      url : '/remove',
      data : body,
      type : 'DELETE'
    });
    $(this).parent().remove();
  });
$('#login-form-login').on('click', function(){     //listener for login in button
  authenticateUser();
});
$("#login-form").on( "keydown", function(event) {
  if(event.which == 13) 
    authenticateUser();
    });
function authenticateUser() {
  var emailName = $('#email-login').val();
  var passwordName = $('#password-login').val();
  var credentials = {
    username : emailName,
    password : passwordName
  };
  var accountReal = $.post('/hidden', credentials)   //calls the server to authenticate the user
                      .done(function(){
                                $('.main-page-container').hide();
                                pages.mainAccountPanel.css('display', 'flex')
                                $('#login-form').hide();
                                account = credentials.username;
                              });
                            
}
$('#account-create-button').on('click', function(){  //handler for account creation
  var emailName = $('#sign-up-email').val();
  var passwordName = $('#sign-up-password').val();
  var passwordVerify = $('#sign-up-password-verify').val();
  if (passwordName === passwordVerify){
      var credentials = {
        email : emailName,
        password : passwordName
      };
      $.post('/users', credentials)     //makes call to the server to create a new account
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
  else {
    pages.signUpPage.hide();
  }
  });

function newMessageOrCall(Route){
  var body = {
    username : account,
    messageName : $('#message-name').val(),
    date : $('#datepicker').val(),
    time : $('#new-message-time').val(),
    messageText : $('#message-body').val(),
    contact : $('#contact-name-new-message').val()
  };
  $.post(Route, body);      //calls the server with the info needed to create the new message
  $('#confirm-message-created').fadeIn(500).delay(500).fadeOut(300);  //shows message created
  returnMainPage();
}
function returnMainPage(){
    pages.signUpPage.hide();
    pages.inlineContactForm.hide();
    pages.pendingMessagePage.hide();
    pages.newMessagePage.hide();
    pages.contactPage.hide();
    pages.mainAccountPanel.show();
 }
