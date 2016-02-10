'use strict';

var c = require('colors');

module.exports = {
  parseArgs: function parseArgs(args) {
    return Object.keys(args).map(function (elem) {
      try {
        return JSON.strigify(elem);
      } catch (e) {
        return args[elem];
      }
    }).join(' ');
  },


  all: function all() {
    return c.bgWhite(c.black('Monitoring Server')) + ' - ';
  },

  warn: function warn() {
    console.log(this.all() + c.cyan('Warning: ') + this.parseArgs(arguments));
  },

  err: function err() {
    console.log(this.all() + c.red('Error: ') + this.parseArgs(arguments));
  },

  log: function log() {
    console.log(this.all() + c.grey('Log: ') + this.parseArgs(arguments));
  },

  info: function info() {
    console.log(this.all() + c.blue('Info: ') + this.parseArgs(arguments));
  },

  success: function success() {
    console.log(this.all() + c.green('Success: ') + this.parseArgs(arguments));
  }
};