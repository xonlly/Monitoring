"use strict"

class Rooms {

  constructor( options, socketio ) {
    // ['initServers', 'initClients'].forEach((k) => this[k]( socketio ))
    this.io = socketio
  }

  /**
   * Init la room pour les serveurs
   */
  initServers( socket ) {

    let io = this.io

    /* On server join */
    socket.on('join', (data) => {
      console.log('join')
    })

    /* Server send new infos */
    socket.on('update', (data) => {
      console.log('update', data)
    })

  }

  /**
   * Init la room pour les clients
   */
  initClients( io, socket ) {



  }

  sendToClients() {

  }

}

module.exports = Rooms;
