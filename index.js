
/**
 * Module dependencies
 */
var httpProxy = require("http-proxy"),
    proxy = new httpProxy.RoutingProxy();

module.exports = function(path, host, port, https) {
  if (!port) port = 80;
  if (typeof https == "undefined") https = true;

  return function simpleHttpProxy(req, res, next) {
    // Are we connecting to the proxy?
    if (req.url.indexOf(path) === 0) {
   
      // Remove the the path from the url
      req.url = req.url.replace(path, "");
   
      // replace the host or your network will freak out
      req.headers.host = host;
   
      // proxy the bad boy
      return proxy.proxyRequest(req, res, {
        port: port,
        host: host,
        https: https
      });
    }
    next();
  }
}