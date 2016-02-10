"use strict"

const Rooms = require('./rooms')
const Log = require('../../utils/log')

class Clients extends Rooms {

  constructor( options, socketio ) {
      super( options, socketio )

      this.options = options;
  }

  connection( socket ) {


    socket.on('auth', (key) => {
      if ( this.options.key == key ) {
        socket.isAuth = true
        socket.emit('isAuth', { success : true });
      } else {
        socket.isAuth = false
        socket.emit('isAuth', { success : false, error : 'KEY_IS_NOT_VALID' });
      }
    })

    socket.on('delete', (name) => {

      if (!this.isAuth( socket )) return;

      Log.err('User delete server ' + name)

      this.deleteServer( name );

    })

    /* if user need change room */
    socket.on('room', (data) => {

      if (!this.isAuth( socket )) return;

      Log.info('User join room:', data);

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
