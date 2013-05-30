/**
 * Module dependencies
 */
var express = require("express");

var app = module.exports = express();

app.use(require("connect-base")());

app.get('/header', function(req, res, next) {
  res.json(req.headers);
});

app.use(function(req, res, next) {
  res.send(req.base);
});
