var express = require('express');
var $ = require('jquery');
var app = express();
app.use(express.static('public'));
app.listen(process.env.PORT || 8080);
console.log("server started on 8080");
exports.app = app;
