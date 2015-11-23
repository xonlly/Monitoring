"use strict"


var MonitoringConfig = {
  ProjectConfig : {
    apikey : "demo",
    Name : "Devteck.eu",
    Route : "Devteck",
    Description : "Hello World",
    Interval : 1000, // 10 sec to refresh / send infos
  },
  global : {
    SERVER : 'localhost',
    PORT : 8156,
    apikey : "demo",
  }
}



// project.emit('add', ProjectConfig);

class Monitoring {

  getIOHost() {
    return 'http://'+this.config.global.SERVER+':'+this.config.global.PORT;
  }

  constructor(config) {

    this.config = config;

    this.init()

    this.IOproject.on('connect', () => {
      console.log('connect project')
      setInterval(() => {
        // Demande une création du projet sur le serveur.
        this.create(config)

      }, config.Interval);
    })
  }

  init() {
    this.IOproject = require('socket.io-client')(this.getIOHost + '/project');
  }

  create(config) {


      this.IOproject.emit('add', config.ProjectConfig);

  }

}

new Monitoring(MonitoringConfig)

return ;
setInterval(() => {

  project.emit('add', { apikey : 'demo', projectDescription : 'Hello world' });

}, 1000)
