"use strict"

const SocketClient = require('../transmitter/socket')

class Client extends SocketClient {

  constructor( options ) {
    super( options )

    const socket = this.get()
    
    socket.on('connect', function(){});
    socket.on('event', function(data){});
    socket.on('disconnect', function(){});
  }
}

module.exports = Client
