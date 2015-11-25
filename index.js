"use strict"

var config = {
  PORT : 8156,
  APIKEY : 'demo',
}


var io = require('socket.io')(config.PORT)
var Listeners = new (require('./core/Listeners'))(io,config)


var fs = require('fs'),
    http = require('http');

http.createServer(function (req, res) {
  console.log(__dirname + '/www/' + req.url);
  fs.readFile(__dirname + '/www/' + req.url, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
}).listen(8085);
