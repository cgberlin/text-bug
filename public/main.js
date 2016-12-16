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
  var dateToday = new Date(); 
  $( "#datepicker" ).datepicker({ minDate: dateToday});
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
  $('#message-sent-display').hide();
  $('#message-created-display').hide();
  });

$('#contacts-button').on('click', function(){      // listenter to open the contact container
  $('#list-of-contacts').empty();
  pages.pendingMessagePage.hide();
  pages.mainAccountPanel.hide();
  pages.contactPage.show();
  $('#message-sent-display').hide();
  $('#message-created-display').hide();
  var body = {
    username : account
    }
  updateContactPage(body);
  });
$('#submit-instant-message').on('click', function(){
  var body = {
    username : account,
    messageName : $('#message-name').val(),
    date : $('#datepicker').val(),
    time : $('#new-message-time').val(),
    messageText : $('#message-body').val(),
    contact : $('#contact-name-new-message').val()
  };
  if (!body.contact){
    alert('Need to specify contact');
  }
  else if (!body.messageText) {
    alert('Need to include message text');
  }
  else {
    newMessageOrCall('/instant', body);
  }
});
$('#submit-new-message').on('click', function(){      //listener for new message submit button
  var body = {
    username : account,
    messageName : $('#message-name').val(),
    date : $('#datepicker').val(),
    time : $('#new-message-time').val(),
    messageText : $('#message-body').val(),
    contact : $('#contact-name-new-message').val()
  };
  if (!body.messageName) {
    alert('Need message name');
  }
  else if (!body.contact) {
    alert('Need to specify contact');
  }
  else if (!body.date) {
    alert('Need to specify date');
  }
  else if (!body.messageText) {
    alert('Need to specify message text');
  }
  else {
     newMessageOrCall('/create-message', body);  
     }   
  });
$('#submit-new-call-button').on('click', function(){
  newMessageOrCall('/create-call');      //calls the server with the info needed to create the new message
});
$('#view-pending-button').on('click', function(){    //brings up the pending messages panel
  pages.mainAccountPanel.hide();
  pages.pendingMessagePage.show();
  $('#message-sent-display').hide();
  $('#message-created-display').hide();
  $('#list-of-messages').empty();
  var body = {
    username : account
  }
  $.get('/messages', body)    //call to retrieve the list of sent messages, then appends to the page
      .done(function(pendingMessages){
        var newMessageArray = pendingMessages.slice(Math.max(pendingMessages.length - 10, 1))
        for (var length = newMessageArray.length,  i = 0; i < length; i++){
          $('#list-of-messages').append('<div class ="pending-message"><p>Name:'+' '+newMessageArray[i].contact+
                                                        ' '+'-------'+' '+'Date:'+' '+newMessageArray[i].date);
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

function newMessageOrCall(Route, body){
  if (Route == '/instant') {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd
    } 
    if(mm<10) {
        mm='0'+mm
    } 
    today = mm+'/'+dd+'/'+yyyy;
    body.date = today;
    $('#message-sent-display').fadeIn(500);
  }
  else {
    $('#message-created-display').fadeIn(500);
  }
  $.post(Route, body);      //calls the server with the info needed to create the new message
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
