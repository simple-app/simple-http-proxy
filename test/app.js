/**
 * Module dependencies
 */
var express = require("express");

var app = module.exports = express();

app.use(require("connect-base")());

app.use(function(req, res, next) {
  res.send(req.base);
});
