# Text Bug
## A web app to help with text reminders and more
At the current stage of development the API is able to create, store, and save accounts and contacts for each account.
Once an account is created you can create custom text messages to be sent on a specified date and time.
There are plans for future features, some of which I have already begun to work on.
Please read below for more info.

![alt text](http://i.imgur.com/iHlZ8ZD.png "Landing Page")

## Summary
Text Bug will allow a user to add or upload contacts. Once contacts are uploaded the user will be able to
send text messages or phone calls to single or groups of people that they have previously saved as contacts.
They can specify the date and time for messages/phone calls to be sent, or even choose
"every other X day of the week". The user can also specify what behavior they want to happen
when the person receiving the message/call replies.

Possible applications are auto-reminders for recurring events, either to yourself, someone else, or a group of people,
automated check-in calls or texts that happen on a recurring basis, with a specified parameter to be triggered
should the person not reply within X amount of time, and many more that I am sure I haven't thought of yet.

## Technology used
I built Text Bug using Node.js and express on the backend.
For the calling/messaging I used the Sinch API.
The cron npm package was used to trigger events at specified times.
I used the passport middleware for user authentication, and mongodb/mongoose for the database storage.
For quick styling of the front-end I chose bootstrap, but that may change eventually.

![alt text](http://i.imgur.com/FU6N8OT.png "Account Panel")

![alt text](http://i.imgur.com/AHuJwlY.png "Contact Page")

![alt text](http://i.imgur.com/nCB8zTV.png "New Message Panel")
