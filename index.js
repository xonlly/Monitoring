"use strict"

var config = {
  PORT : 8156,
  APIKEY : 'demo',
}


var io = require('socket.io')(config.PORT)
var Listeners = new (require('./core/Listeners'))(io,config)
