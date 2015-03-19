simple-http-proxy [![Build Status](https://travis-ci.org/simple-app/simple-http-proxy.png?branch=master)](https://travis-ci.org/simple-app/simple-http-proxy)
=================

Simple proxy middleware for connect/express

Usage
-----

Create an http app
```js
/**
 * Module dependencies
 */
var express = require('express');
var proxy = require('simple-http-proxy');

/**
 * Expose the app
 */
var app = module.exports = express();

/**
 * Mount the proxy middleware
 */
app.use('/api', proxy('http://my.other.host.com/path-to-proxy'));
```

Make the request
```sh
$ curl http://localhost:5000/api

<h1>Welcome to my.other.host.com/path-to-proxy</h1>
```

You can also specify some options as a second parameter

```js
app.use('/api', proxy('http://my.other.host.com/path-to-proxy', opts));
```

### Options

#### `cookies`

Disable sending cookies by passing `false`; on by deafult.

#### `xforward`

Setting this to `true` will set `x-forwarded-proto`, `x-forwarded-host`, `x-forwarded-port` and `x-forwarded-path` headers.

Passing an object will override the header names:

```js
{
  proto: 'x-orig-proto',
  host: 'x-orig-host',
  port: 'x-orig-port',
  path: 'x-orig-path'
}
```

#### `timeout`

A positive millisecond value for the timeout of the request. Defaults to 10000 (10s).

Setting it to `false` will disable the timeout.

#### `onrequest`

A function to be called on each request. The first parameter will be the [options object](http://nodejs.org/api/http.html#http_http_request_options_callback) for the http request. The second will be the [request object](http://nodejs.org/api/http.html#http_class_http_clientrequest).

This can be used to change any of the http options for a given request.

#### `onresponse`

A function to be called on each response. The first parameter will be the [incoming message](http://nodejs.org/api/http.html#http_http_incomingmessage) for a given request. The second will be the [server response object](http://nodejs.org/api/http.html#http_class_http_serverresponse).

If this function returns `true` the default pipe will not be used and will be up to the `onresponse` function to implement that behavior. This is useful for rewriting responses that are sent to the client.

Tests
-----

```sh
$ npm test
```
simple-http-proxy [![Build Status](https://travis-ci.org/simple-app/simple-http-proxy.png?branch=master)](https://travis-ci.org/simple-app/simple-http-proxy)
=================

Simple proxy middleware for connect/express

Usage
-----

Create an http app
```js
/**
 * Module dependencies
 */
var express = require('express');
var proxy = require('simple-http-proxy');

/**
 * Expose the app
 */
var app = module.exports = express();

/**
 * Mount the proxy middleware
 */
app.use('/api', proxy('http://my.other.host.com/path-to-proxy'));
```

Make the request
```sh
$ curl http://localhost:5000/api

<h1>Welcome to my.other.host.com/path-to-proxy</h1>
```

You can also specify some options as a second parameter

```js
app.use('/api', proxy('http://my.other.host.com/path-to-proxy', opts));
```

### Options

#### `cookies`

Disable sending cookies by passing `false`; on by deafult.

#### `xforward`

Setting this to `true` will set `x-forwarded-proto`, `x-forwarded-host`, `x-forwarded-port`, `x-forwarded-path` and `x-forwarded-for` headers.

Passing an object will override the header names:

```js
{
  proto: 'x-orig-proto',
  host: 'x-orig-host',
  port: 'x-orig-port',
  path: 'x-orig-path'
}
```

#### `timeout`

A positive millisecond value for the timeout of the request. Defaults to 10000 (10s).

Setting it to `false` will disable the timeout.

#### `onrequest`

A function to be called on each request. The first parameter will be the [options object](http://nodejs.org/api/http.html#http_http_request_options_callback) for the http request. The second will be the [request object](http://nodejs.org/api/http.html#http_class_http_clientrequest).

This can be used to change any of the http options for a given request.

#### `onresponse`

A function to be called on each response. The first parameter will be the [incoming message](http://nodejs.org/api/http.html#http_http_incomingmessage) for a given request. The second will be the [server response object](http://nodejs.org/api/http.html#http_class_http_serverresponse).

If this function returns `true` the default pipe will not be used and will be up to the `onresponse` function to implement that behavior. This is useful for rewriting responses that are sent to the client.

Tests
-----

```sh
$ npm test
```
