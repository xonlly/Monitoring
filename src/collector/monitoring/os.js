"use strict"

const os = require('os')

class OsMonitor {

  constructor() {
    this.listenCpu()
  }

  listenCpu() {
    function cpuAverage() {

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

    let liveCpu = () => {
      //Grab first CPU Measure
      var startMeasure = cpuAverage();
      var moyenneCpuArr = [];

      //Set delay for second Measure
      setInterval(() => {

        //Grab second Measure
        var endMeasure = cpuAverage();

        //Calculate the difference in idle and total time between the measures
        var idleDifference = endMeasure.idle - startMeasure.idle;
        var totalDifference = endMeasure.total - startMeasure.total;

        //Calculate the average percentage CPU usage
        var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);


        if (moyenneCpuArr.length > 5) {
          this.currentCPU = moyenneCpu(moyenneCpuArr);
          moyenneCpuArr = []; // Reset du tableau a >5
        }

        moyenneCpuArr.push(percentageCPU);
        startMeasure = cpuAverage();

      }, 100);
    }

    function moyenneCpu(moyenneCpu) {
      var moy = 0;
      for (var i=0; i<moyenneCpu.length; i++) {
        moy += parseInt(moyenneCpu[i]);
      }

      return moy / (moyenneCpu.length);
    }


    liveCpu()
  }

  getCpu() {
    return this.currentCPU
  }

  getRam() {

  }

  osGetAll() {
    return {
      name : os.hostname ? os.hostname() : false,
      arch: os.arch ? os.arch() : false,
      cpus: os.cpus ? os.cpus() : false,
      freemem: os.freemem ? os.freemem() : false,
      totalmem: os.totalmem ? os.totalmem() : false,
      mempourcent: 100 - (os.freemem() * 100 / os.totalmem()),
      homedir: os.homedir ? os.homedir() : false,
      loadavg: os.loadavg ? os.loadavg() : false,
      networkInterfaces: os.networkInterfaces ? os.networkInterfaces() : false,
      platform: os.platform ? os.platform() : false,
      release: os.release ? os.release() : false,
      type: os.type ? os.type() : false,
      uptime: os.uptime ? os.uptime() : false,
      cpuAverage: this.currentCPU,
    }
  }

}

module.exports = OsMonitor
