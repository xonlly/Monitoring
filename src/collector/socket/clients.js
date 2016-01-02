"use strict"

const Rooms = require('./rooms')

class Clients extends Rooms {

  constructor( options, socketio ) {
      super( options, socketio )
  }

  connection( socket ) {


    /* if user need change room */
    socket.on('room', (data) => {
      console.log('change room', data);
      switch (data) {
        case 'server':

          socket.join( 'servers' )
          this.initServer( socket )
          
          break;
        case 'client':

          socket.join( 'clients' )
          this.initClient( socket )

          break;
        default:

      }
    })

  }


}

module.exports = Clients;
