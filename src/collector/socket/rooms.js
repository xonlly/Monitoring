"use strict"

const Log = require('../../utils/log')

class Rooms {

  constructor( options, socketio ) {
    // ['initServers', 'initClients'].forEach((k) => this[k]( socketio ))
    this.io = socketio
    let io  = this.io
    this.servers = {};

    setInterval(() => {
      // Send to all clients all servers data.
      io.sockets.to('clients')
        .emit('update', {
          servers : this.servers,
          datas : {},
        });

    }, 1000)
  }

  /**
   * For check if user is auth to run.
   */
  isAuth( socket ) {
    if (socket.isAuth) {
      return true
    } else {
      Log.warn('User is not auth to exec this function')
      socket.emit('isAuth', { success : false, error : 'YOU_DONT_HAVE_PERMS' })
      return false
    }
  }

  /**
   * Init la room pour les serveurs
   */
  initServer( socket ) {

    let io = this.io

    /* Server send new infos */
    socket.on('update', (data) => {
      // Socket save Name.
      socket.nickname = data.name;

      // Update & create data to all servers.
      this.servers[data.name] = { id : socket.id, os : data, online: true }
    })

  }

  disconnect( socket ) {
    let io = this.io

      Log.info('Disconnect ', socket.nickname)

      // Is not a server
      if (!this.servers[socket.nickname]) return;

      this.servers[socket.nickname].online = false;


  }

  /**
   * Init la room pour les clients
   */
  initClient( socket ) {
    let io = this.io

    Log.info('New client, total ' + Object.keys(io.sockets.adapter.rooms.clients).length)

  }

  sendToClients() {

  }

}

module.exports = Rooms;
