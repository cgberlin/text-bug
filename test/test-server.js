var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

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
});
