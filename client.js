"use strict"

var os = require('os');

var MonitoringConfig = {
  ProjectConfig : {
    apikey : "demo",
    Name : os.hostname(),
    Route : os.hostname(),
    Description : "Hello World",
    Interval : 60000, // 10 sec to refresh / send infos
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

    this.connected = false;
    this.config = config;

    this.init()
    this.liveCpu(); // Calculate live CPU usage
    this.currentCPU = 0;


    this.IOproject

    .on('connect', () => {

      this.connected = true;
      console.log('Connexion is open to Master.');
      this.create()

    })

    .on('disconnect', () => {

      this.connected = false;
      console.log('Connexion closed by Master or Network.');

    })

    .on('update', () => {
      console.log('Master need infos.');
      this.IOproject.emit('data', {
        os : this.os()
      })
    })
  }

  cpuAverage() {

    //Initialise sum of idle and time of cores and fetch CPU info
    var totalIdle = 0, totalTick = 0;
    var cpus = os.cpus();
    var type = os.type();

    //Loop through CPU cores
    for(var i = 0, len = cpus.length; i < len; i++) {

     //Select CPU core
     var cpu = cpus[i];

     //Total up the time in the cores tick
     for(type in cpu.times) {
       totalTick += cpu.times[type];
    }

     //Total up the idle time of the core
     totalIdle += cpu.times.idle;
    }

    //Return the average Idle and Tick times
    return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
  }

  liveCpu() {
    //Grab first CPU Measure
    var startMeasure = this.cpuAverage();
    var moyenneCpu = [];

    //Set delay for second Measure
    setInterval(() => {

      //Grab second Measure
      var endMeasure = this.cpuAverage();

      //Calculate the difference in idle and total time between the measures
      var idleDifference = endMeasure.idle - startMeasure.idle;
      var totalDifference = endMeasure.total - startMeasure.total;

      //Calculate the average percentage CPU usage
      var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);


      if (moyenneCpu.length > 5) {
        this.currentCPU = this.moyenneCpu(moyenneCpu);
        moyenneCpu = []; // Reset du tableau a >5
      }

      moyenneCpu.push(percentageCPU);
      startMeasure = this.cpuAverage();

    }, 100);
  }

  moyenneCpu(moyenneCpu) {

    var moy = 0;
    for (var i=0; i<moyenneCpu.length; i++) {
      moy += parseInt(moyenneCpu[i]);
    }

    return moy / (moyenneCpu.length);

  }

  os() {
    return {
      arch: os.arch(),
      cpus: os.cpus(),
      freemem: os.freemem(),
      totalmem: os.totalmem(),
      mempourcent: 100 - (os.freemem() * 100 / os.totalmem()),
      homedir: os.homedir(),
      loadavg: os.loadavg(),
      networkInterfaces: os.networkInterfaces(),
      platform: os.platform(),
      release: os.release(),
      type: os.type(),
      uptime: os.uptime(),
      cpuAverage: this.currentCPU,
    }
  }

  init() {
    this.IOproject = require('socket.io-client')(this.getIOHost() + '/project');
  }

  create() {


      this.IOproject.emit('add', this.config.ProjectConfig);

  }

}

new Monitoring(MonitoringConfig)

return ;
setInterval(() => {

  project.emit('add', { apikey : 'demo', projectDescription : 'Hello world' });

}, 1000)
