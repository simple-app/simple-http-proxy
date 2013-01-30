
/**
 * Module dependencies
 */
var httpProxy = require("http-proxy"),
    RoutingProxy = httpProxy.RoutingProxy,
    url = require("url");

module.exports = function(path, endpoint) {
  var parsedUrl = url.parse(endpoint);

  var https = parsedUrl.protocol.indexOf("https") === 0
    , host = parsedUrl.host
    , hostname = parsedUrl.hostname
    , port = parsedUrl.port || (https ? 443 : 80)
    , base = parsedUrl.path;

  if (base === "/") {
    base = "";
  }

  var proxy = new RoutingProxy({
    enable: {
      xforward: true
    },
    target: {
      https: https,
      hostname: hostname,
      host: host,
      port: port
    }
  });

  return function simpleHttpProxy(req, res, next) {
    // Are we connecting to the proxy?
    if (req.url.indexOf(path) === 0) {
   
      // // Remove the the path from the url
      if(path) {
        req.url = req.url.replace(path, base);
      }

      // Modify the host header
      req.headers.host = host + (https ? (port === 443 ? "" : ":"+port) : (port === 80 ? "" : ":"+port));

      // proxy the bad boy
      return proxy.proxyRequest(req, res, {
        host: host,
        hostname: hostname,
        port: port
      });
    }
    next();
  }
}