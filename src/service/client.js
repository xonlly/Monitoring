"use strict"

const SocketClient = require('../transmitter/socket')
const Log = require('../utils/log')

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
      socket.emit('auth', options.key)
    });

    socket.on('isAuth', (data) => {
      if (!data.success) {
        Log.err(data.error);
      } else {
        // If user is auth on login, i join the room for send infos to server
        socket.emit('room', 'server')
        Log.success('You are connected to master');
      }
    })

    socket.on('disconnect', () => {
      this.options.connected = false
      Log.err('You are disconnect from master !');
    });
  }
}

module.exports = Client
