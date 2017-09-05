// test/app_spec.js

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('Backend', function() {
  describe('/editor/spec', function() {
    it('responds with status 200', function(done) {
      chai.request(app)
        .get('/editor/spec')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

describe('Editor', function() {
  describe('/editor', function() {
    it('responds with status 200', function(done) {
      chai.request(app)
        .get('/editor')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
