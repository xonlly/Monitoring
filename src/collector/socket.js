"use strict"


const Clients = require('./socket/clients')

class Socket {

  constructor ( options ) {

    const SocketIo = require('socket.io')(options.port || 8080)

    this.clients = new Clients( options, SocketIo )

    SocketIo.on('connection', (socket) => {

      console.log('bonjour')

      this.clients.connection( socket )

      socket.on('disconnect', () => this.clients.disconnect( socket ))

    })

  }



}

module.exports = Socket;
