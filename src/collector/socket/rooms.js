"use strict"

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
   * Init la room pour les serveurs
   */
  initServer( socket ) {

    let io = this.io
    console.log('bonjour server')
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

      console.log('disconnect name, ', socket.nickname)

      // Is not a server
      if (!this.servers[socket.nickname]) return;

      this.servers[socket.nickname].online = false;


  }

  /**
   * Init la room pour les clients
   */
  initClient( socket ) {
    let io = this.io

    console.log('new client, total ' + Object.keys(io.sockets.adapter.rooms.clients).length)


  }

  sendToClients() {

  }

}

module.exports = Rooms;
