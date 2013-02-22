simple-http-proxy
============

Simple proxy middleware for connect/express

Usage
-----

Create an http app
```js
/**
 * Module dependencies
 */
var express = require("express")
  , proxy = require("simple-http-proxy");

/**
 * Expose the app
 */
var app = module.exports = express();

/**
 * Mount the proxy middleware
 */
app.use("/api", proxy("http://my.other.host.com/path-to-proxy"));
```

Make the request
```sh
$ curl http://localhost:5000/api

<h1>Welcome to my.other.host.com/path-to-proxy</h1>
```

You can also specify some options as a second parameter

```
// snip

app.use("/api", proxy("http://my.other.host.com/path-to-proxy", {

  // Disable sending cookies; on by deafult
  cookies: false,

  // Add x-forwarded-* headers to proxy request
  xforward: true,

  // Change the timeout length of the proxy (defaults to 10 seconds)
  timeout: 20000
}));

// snip
```
