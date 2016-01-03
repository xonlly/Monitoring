"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var os = require('os');

var OsMonitor = (function () {
  function OsMonitor() {
    _classCallCheck(this, OsMonitor);

    this.listenCpu();
  }

  _createClass(OsMonitor, [{
    key: "listenCpu",
    value: function listenCpu() {
      var _this = this;

      function cpuAverage() {

        //Initialise sum of idle and time of cores and fetch CPU info
        var totalIdle = 0,
            totalTick = 0;
        var cpus = os.cpus();
        var type = os.type();

        //Loop through CPU cores
        for (var i = 0, len = cpus.length; i < len; i++) {

          //Select CPU core
          var cpu = cpus[i];

          //Total up the time in the cores tick
          for (type in cpu.times) {
            totalTick += cpu.times[type];
          }

          //Total up the idle time of the core
          totalIdle += cpu.times.idle;
        }

        //Return the average Idle and Tick times
        return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
      }

      var liveCpu = function liveCpu() {
        //Grab first CPU Measure
        var startMeasure = cpuAverage();
        var moyenneCpuArr = [];

        //Set delay for second Measure
        setInterval(function () {

          //Grab second Measure
          var endMeasure = cpuAverage();

          //Calculate the difference in idle and total time between the measures
          var idleDifference = endMeasure.idle - startMeasure.idle;
          var totalDifference = endMeasure.total - startMeasure.total;

          //Calculate the average percentage CPU usage
          var percentageCPU = 100 - ~ ~(100 * idleDifference / totalDifference);

          if (moyenneCpuArr.length > 5) {
            _this.currentCPU = moyenneCpu(moyenneCpuArr);
            moyenneCpuArr = []; // Reset du tableau a >5
          }

          moyenneCpuArr.push(percentageCPU);
          startMeasure = cpuAverage();
        }, 100);
      };

      function moyenneCpu(moyenneCpu) {
        var moy = 0;
        for (var i = 0; i < moyenneCpu.length; i++) {
          moy += parseInt(moyenneCpu[i]);
        }

        return moy / moyenneCpu.length;
      }

      liveCpu();
    }
  }, {
    key: "getCpu",
    value: function getCpu() {
      return this.currentCPU;
    }
  }, {
    key: "getRam",
    value: function getRam() {}
  }, {
    key: "osGetAll",
    value: function osGetAll() {
      return {
        name: os.hostname ? os.hostname() : false,
        arch: os.arch ? os.arch() : false,
        cpus: os.cpus ? os.cpus() : false,
        freemem: os.freemem ? os.freemem() : false,
        totalmem: os.totalmem ? os.totalmem() : false,
        mempourcent: 100 - os.freemem() * 100 / os.totalmem(),
        homedir: os.homedir ? os.homedir() : false,
        loadavg: os.loadavg ? os.loadavg() : false,
        networkInterfaces: os.networkInterfaces ? os.networkInterfaces() : false,
        platform: os.platform ? os.platform() : false,
        release: os.release ? os.release() : false,
        type: os.type ? os.type() : false,
        uptime: os.uptime ? os.uptime() : false,
        cpuAverage: this.currentCPU
      };
    }
  }]);

  return OsMonitor;
})();

module.exports = OsMonitor;