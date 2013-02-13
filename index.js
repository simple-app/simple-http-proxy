
/**
 * Module dependencies
 */
var superagent = require("superagent")
  , http = require('http');

// Don't let superagent serialize anything
superagent.serialize = {};

module.exports = function(endpoint) {
  return function simpleHttpProxy(req, res, next) {
    // Remove the host header
    var hostInfo = req.headers.host.split(":")
      , host = hostInfo[0]
      , port = hostInfo[1]
      , resPath = req.originalUrl.replace(req.url, "");
    delete req.headers.host;

    // Optionally delete cookie
    delete req.headers.cookie;

    // We'll need to add a / if it's not on there
    if(resPath.indexOf("/") === -1) resPath = "/"+resPath;

    // Send it through superagent
    var request = superagent(req.method, endpoint+req.url)
      .buffer(false)
      .set(req.headers)
      .set({
        "x-forwarded-host": host,
        "x-forwarded-proto": req.protocol,
        "x-forwarded-path": resPath
      });

    if (port) request.set("x-forwarded-port", port);

    // Pipe upstream and downstream
    req.pipe(request);
    request.pipe(res);
  }
}