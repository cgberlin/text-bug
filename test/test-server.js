global.DATABASE_URL =('mongodb://cgberlin:Vagrant@ds053216.mlab.com:53216/text-bug');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var mongoose = require('mongoose');
var Account = require('../models/account');

var should = chai.should();
var app = server.app;


chai.use(chaiHttp);

describe('text-bug', function() {
  it('should respond 200 with html', function(done) {
      chai.request(app)
          .get('/')
          .end(function(err, res) {
              res.should.have.status(200);
              res.should.be.html;
              done();
          });
  });
  it('should not respond 401', function(done) {
      chai.request(app)
          .post('/hidden')
          .send({username: 'asd', password: 'asd'})
          .end(function(err, res) {
              res.should.not.have.status(401);
              done();
          });
  });
  it('should respond with string', function(done){
      chai.request(app)
          .post('/users')
          .send({email : 'ert', password: 'ert'})
          .end(function(err, res){
            res.should.be.string;
            done();
          });
  });
});

/*Juan Garcia12:54 pm
1- work with the test on login
Juan Garcia12:54 pm
2- use the same test in the before of each unit test*/
