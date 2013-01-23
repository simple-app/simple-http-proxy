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

app.use(proxy("/api", "my.other.host.com"));
```

Make the request
```sh
$ curl http://localhost:5000/api

<h1>Welcome to my.other.host.com</h1>
```

Options
-------

proxy(route, host, https, port)

### route (string i.e. "/api")

Route on which to mount proxy

### host (string i.e. "google.com")

Target host

### https (bool)

Target uses https

### port (integer)

Target port