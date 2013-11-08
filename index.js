
/**
 * Module dependencies
 */

var url = require('url')
  , debug = require('debug')('simple-http-proxy')
  , protocols = {
      http: require('http'),
      https: require('https')
    };

/**
 * Proxy an endpoint with options
 *
 * @param {String} endpoint
 * @param {Object} opts
 * @return {Function}
 * @api public
 */

module.exports = function(endpoint, opts) {
  if(!opts) opts = {};

  var parsedUrl = url.parse(endpoint);

  // Should we keep the trailing slash on a root request?
  var trailingSlash = endpoint[endpoint.length - 1] === '/';

  // If we've got a trailing slash remove it
  if (parsedUrl.pathname === '/') parsedUrl.pathname = '';
  if (trailingSlash) parsedUrl.pathname = parsedUrl.pathname.slice(0, parsedUrl.pathname.length - 1);

  var xforward;
  // x-forward headers
  if (opts.xforward) {
    xforward = {};
    ['proto', 'host', 'path', 'port'].forEach(function(header) {
      xforward[header] = opts.xforward[header] || 'x-forwarded-' + header;
    });
  }

  return function simpleHttpProxy(req, res, next) {
    // Get our forwarding info
    var hostInfo = req.headers.host.split(':');

    // Remove the host header
    delete req.headers.host;

    // Optionally delete cookie
    if(opts.cookies === false) delete req.headers.cookie;

    // Resolve the url
    var path = parsedUrl.pathname + (!trailingSlash && req.url === '/' ? '' : req.url);

    // Setup the options
    var options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      headers: req.headers,
      path: path,
      method: req.method
    };

    // Enable forwarding headers
    if(xforward) {
      // Get the path at which the middleware is mounted
      var resPath = req.originalUrl.replace(req.url, '');

      // We'll need to add a / if it's not on there
      if(resPath.indexOf('/') !== 0) resPath = '/' + resPath;

      // Pass along our headers
      options.headers[xforward.proto] = req.headers[xforward.proto] || req.connection.encrypted ? 'https' : 'http';
      options.headers[xforward.host] = req.headers[xforward.host] || hostInfo[0];
      options.headers[xforward.path] = req.headers[xforward.path] || resPath;

      if (hostInfo[1]) options.headers[xforward.port] = req.headers[xforward.port] || hostInfo[1];
    }

    /**
     * Hack for nginx backends where node, by default, sends no 'content-length'
     * header if no data is sent with the request and sets the 'transfer-encoding'
     * to 'chunked'. Nginx will then send a 411 because the body contains a '0'
     * which is the length of the chunk
     *
     *     GET /proxy
     *     transfer-encoding: chunked
     *     
     *     0
     *
     */
    if(~['POST', 'DELETE'].indexOf(req.method) && options.headers['transfer-encoding'] != 'chunked') {
      options.headers['content-length'] = options.headers['content-length'] || '0';
    }

    debug('sending proxy request', options);

    // Make the request with the correct protocol
    var request = protocols[(parsedUrl.protocol || 'http').replace(':', '')].request(options, function(response) {
      debug('got response');

      // Send down the statusCode and headers
      debug('sending head', response.statusCode, response.headers);
      res.writeHead(response.statusCode, response.headers);

      // Pipe the response
      debug('piping response');
      response.pipe(res);
    });

    // Handle any timeouts that occur
    request.setTimeout(opts.timeout || 10000, function() {
      // Clean up the socket
      // TODO is there a better way to do this? There's a 'socket hang up' error being emitted...
      request.setSocketKeepAlive(false);
      request.socket.destroy();

      // Mark this as a gateway timeout
      res.status(504);
      next(new Error('Proxy to "'+endpoint+'" timed out'));
    });

    // Pipe the client request upstream
    req.pipe(request);

    // Pass on our errors
    request.on('error', next);
  }
}
