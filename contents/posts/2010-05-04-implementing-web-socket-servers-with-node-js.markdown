---
layout: post
title: Implementing Web Socket servers with Node.js
published: true
meta:
  dsq_thread_id: ""
  _edit_lock: "1275703091"
  _edit_last: "1"
tags:
- Code
- JS
- Realie
type: post
status: publish
published_at: 1272931200000
---
Web Sockets are one of the most interesting features included in HTML5 spec. It would open up a whole different paradigm in web application development by allowing asynchronous, long-lived connections between client and server. As Web Sockets were supported in Google Chrome's beta release, it signaled now the time to use it in your apps.

However, WebSockets doesn't really go well with the traditional synchronized web server environments. Use of evented libraries such as <a href="http://nodejs.org">Node.js</a> for Web Socket servers seemed more practical and scalable. But the initial versions of Node.js's didn't have built-in support for Web Socket connections specifically. There were several Web Socket server implementations based Node.js, which overcame this problem by hijacking its HTTP module.

Node.js still doesn't include WebSockets in its core modules as in other languages (i.e. Go language). However, the recent overhaul to HTTP module, have made implementation of web sockets with whole lot easy. Now Node.js's HTTP server module would emit "Upgrade" event, each time a client requests a http upgrade. This event could be trapped when implementing a web socket server.

Here is a simple, low-level example for a Node.js based HTTP server, which supports both common HTTP requests and web socket connections.

```javascript
var sys = require("sys");
var net = require("net");
var http = require("http");

function createTestServer(){
  return new testServer();
};

function testServer(){
  var server = this;
  http.Server.call(server, function(){});

  server.addListener("connection", function(){
    // requests_recv++;
  });

  server.addListener("request", function(req, res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("okay");
    res.end();
  });

  server.addListener("upgrade", function(req, socket, upgradeHead){
    socket.write( "HTTP/1.1 101 Web Socket Protocol Handshake\r\n"
                + "Upgrade: WebSocket\r\n"
                + "Connection: Upgrade\r\n"
                + "WebSocket-Origin: http://localhost:3400\r\n"
                + "WebSocket-Location: ws://localhost:3400/\r\n"
                + "\r\n"
                );

    request_upgradeHead = upgradeHead;

    socket.ondata = function(d, start, end){
      //var data = d.toString('utf8', start, end);
      var original_data = d.toString('utf8', start, end);
      var data = original_data.split('\ufffd')[0].slice(1);
      if(data == "kill"){
        socket.end();
      } else {
        sys.puts(data);
        socket.write("\u0000", "binary");
        socket.write(data, "utf8");
        socket.write("\uffff", "binary");
      }
    };
  });
};

sys.inherits(testServer, http.Server);

var server = createTestServer();
server.listen(3400);
```

There is a more high-level and elegant <a href="http://github.com/miksago/node-websocket-server">Web Socket Server library (http://github.com/miksago/node-websocket-server)</a>  in development by Micheil Smith. It is built utilizing the new HTTP library and compatible with the <a href="http://www.whatwg.org/specs/web-socket-protocol/">draft 76</a> of the Web Sockets spec (which includes bunch of security improvements).

Here is an example, on how to implement a web socket server with the above mentioned library.

```javascript
var sys = require("sys");
var ws = require('./vendor/node-websocket-server/lib/ws');

function log(data){
  sys.log("\033[0;32m"+data+"\033[0m");
}

var server = ws.createServer();
server.listen(3400);

server.addListener("request", function(req, res){
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("okay");
  res.end();
});

server.addListener("client", function(conn){
  log(conn._id + ": new connection");
  conn.addListener("readyStateChange", function(readyState){
    log("stateChanged: "+readyState);
  });

  conn.addListener("open", function(){
    log(conn._id + ": onOpen");
    server.clients.forEach(function(client){
      client.write("New Connection: "+conn._id);
    });
  });

  conn.addListener("close", function(){
    var c = this;
    log(c._id + ": onClose");
    server.clients.forEach(function(client){
      client.write("Connection Closed: "+c._id);
    });
  });

  conn.addListener("message", function(message){
    log(conn._id + ": "+JSON.stringify(message));

    server.clients.forEach(function(client){
      client.write(conn._id + ": "+message);
    });
  });
});
```
