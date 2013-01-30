simple-http-proxy
============

Simple proxy middleware for connect/express

Usage
-----

Create an http app
```js
var express = require("express")
  , proxy = require("simple-http-proxy");


var app = express();

app.use(proxy("/api", "http://my.other.host.com/path-to-proxy"));
```

Make the request
```sh
$ curl http://localhost:5000/api

<h1>Welcome to my.other.host.com/path-to-proxy</h1>
```

Options
-------

proxy(route, target)

### route (string i.e. "/api")

Route on which to mount proxy

### host (string i.e. "https://google.com")

Target host of the proxy request. This MUST be a string that can be parsed by [url](http://nodejs.org/api/url.html).
