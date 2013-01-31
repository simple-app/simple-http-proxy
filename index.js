
/**
 * Module dependencies
 */
var httpProxy = require("http-proxy"),
    RoutingProxy = httpProxy.RoutingProxy,
    url = require("url");

module.exports = function(endpoint) {
  var parsedUrl = url.parse(endpoint);

  var https = parsedUrl.protocol?(parsedUrl.protocol.indexOf("https") === 0):false
    , host = parsedUrl.host
    , hostname = parsedUrl.hostname
    , port = parsedUrl.port || (https ? 443 : 80)
    , base = parsedUrl.path;

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
    // Append the base
    req.url = base+((req.url==="/")?"":req.url);

    // Modify the host header
    req.headers.host = host + (https ? (port === 443 ? "" : ":"+port) : (port === 80 ? "" : ":"+port));

    // proxy the bad boy
    proxy.proxyRequest(req, res, {
      host: host,
      hostname: hostname,
      port: port
    });
  }
}