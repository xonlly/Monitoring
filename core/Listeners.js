"use strict"
var Projects = new (require('./Projects'))()
var AreYouAlive = require('./AreYouAlive')

module.exports = class Listeners  {

  constructor(io,config) {
    this.io = io;
    this.config = config;

    Projects.setIo(io);

    // init
    this.init()
  }

  init() {
    this.Gestion(); // Gestion des projets / Users.

    Projects.onAddRoute((Project) => {
      console.log('Create a new AreYouAlive for the project ', Project.Name)
      var aLive = new AreYouAlive(Project)

      aLive.isOffline(() => {

      })

      aLive.isOnline(() => {

      })

      aLive.newStats((data) => {

      })
    })

  }

  Gestion() {
    var clientsListener = {};
    this.io
      .of('/project')
      .on('connection', (socket) => {
        console.log('new connection');
        // data.apikey, data.projectName
        socket.on('add', (data) => {
          if (data.apikey != this.config.APIKEY) return; // For all !
          Projects.add(socket, data);
        })

        socket.on('remove', (data) => {
          if (data.apikey != this.config.APIKEY) return; // For all !
          Projects.remove(socket, data);
        })

        socket.on('update', (data) => {
          if (data.apikey != this.config.APIKEY) return; // For all !
          Projects.update(socket, data);
        })

        socket.on('data', (data) => {
          Projects.update(socket, data);
          socket.broadcast.to('listener').emit('data', data);
          console.log('this data');
        })

        socket.on('listenData', () => {
          console.log('join');
          socket.join('listener')
        })

        socket.on('disconnect', () => {
          Projects.remove(socket);
        })
      });

      this.io
      .of('/listener')
      .on('connection', (socket) => {

        console.log('new client')
        socket.join('listener')

        socket.on('disconnect', () => {
          socket.leave('listener')
        })

      })


      // Pour la gestion des users, surement ici plus tard
  }

}
