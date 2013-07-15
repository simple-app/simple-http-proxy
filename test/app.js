/**
 * Module dependencies
 */

var express = require('express');

var app = module.exports = express();

app.enable('strict routing');

app.use(require('connect-base')());

app.get('/timeout', function(req, res, next) {
  setTimeout(function() {
    res.send(req.base);
  }, 200);
});

app.get('/trailing-slash/', function(req, res, next) {
  res.send('slash');
});

app.use(function(req, res, next) {
  res.send(req.base);
});
