var should = require('should')
  , proxyApp = require('./app')
  , express = require('express')
  , request = require('supertest')
  , proxy = require('..');

var app = express();

app.use('/google', proxy('https://www.google.com'));

describe('simple-http-proxy', function(){

  var server, uri;

  before(function(done) {
    server = proxyApp.listen(function() {
      var address = server.address();

      uri = 'http://'+address.address+':'+address.port;

      app.use('/proxy', proxy(uri));
      app.use('/xforward', proxy(uri, {xforward: true}));
      app.use('/timeout', proxy(uri+'/timeout', {timeout:100}));
      app.use('/trailing-slash', proxy(uri+'/trailing-slash/'));
      done();
    });
  });

  after(function(done) {
    server.close(done);
  });

  it('should proxy an app', function(done) {
    request(app)
      .get('/proxy')
      .expect(uri)
      .end(function(err, res) {
        if(err) return done(err);
        if(!res.ok) return done(new Error(res.text));
        done();
      });
  });

  it('should impose a timeout', function(done) {
    request(app)
      .get('/timeout')
      .expect(504)
      .end(function(err, res) {
        // We *should* get an error
        if(err) return done();
        if(res.ok) return done(new Error(res.text));
        done();
      });
  });

  it('should send xforward headers', function(done) {
    request(app)
      .get('/xforward')
      .expect(/http:\/\/127.0.0.1:[0-9]+\/xforward/)
      .end(function(err, res) {
        if(err) return done(err);
        if(!res.ok) return done(new Error(res.text));
        done();
      });
  });

  it('should proxy an external site', function(done) {
    request(app)
      .get('/google')
      .expect(200)
      .end(function(err, res) {
        if(err) return done(err);
        if(!res.ok) return done(new Error(res.text));
        done();
      });
  });

  it('should proxy correctly with a trailing slash', function(done) {
    request(app)
      .get('/trailing-slash')
      .expect(200)
      .expect('slash')
      .end(function(err, res) {
        if(err) return done(err);
        if(!res.ok) return done(new Error(res.text));
        done();
      });
  });
});
