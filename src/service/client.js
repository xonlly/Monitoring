"use strict"

const SocketClient = require('../transmitter/socket')

class Client extends SocketClient {



  constructor( options ) {
    super( options )

    const socket = this.get()

    this.options = {
      connected : false
    }

    setInterval(() => {
      if (!this.options.connected) return false;

      socket.emit('update', this.osGetAll())

    }, 1000)

    socket.on('connect', () => {
      this.options.connected = true
      socket.emit('room', 'server')
    });

    socket.on('disconnect', () => {
      this.options.connected = false
    });
  }
}

module.exports = Client
