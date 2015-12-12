"use strict"

const Rooms = require('./rooms')

class Clients extends Rooms {

  constructor( options, socketio ) {
      super( options, socketio )
  }

  connection( socket ) {

    this.initServers( socket )

    /* if user need change room */
    socket.on('room', (data) => {
      console.log('change room', data);
      switch (data.room) {
        case 'servers':
          socket.join( 'servers' )
          break;
        case 'client':
          socket.join( 'client' )
          break;
        default:

      }
    })

  }

  disconnect( socket ) {

  }

}

module.exports = Clients;
