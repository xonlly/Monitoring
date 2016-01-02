'use strict'

var c = require('colors');

module.exports = {

    parseArgs(args) {
      return Object.keys(args).map((elem) => {
        try {
          return JSON.strigify(elem)
        } catch (e) {
          return args[elem]
        }
      }).join(' ')
    },

    all : function () {
      return c.bgWhite(c.black('Monitoring Server')) + ' - '
    },

    warn : function () {
      console.log(this.all() + c.cyan('Warning: ') + this.parseArgs(arguments))
    },

    err : function () {
      console.log(this.all() + c.red('Error: ') + this.parseArgs(arguments))
    },

    log : function () {
      console.log(this.all() + c.grey('Log: ') + this.parseArgs(arguments))
    },

    info : function () {
      console.log(this.all() + c.blue('Info: ') + this.parseArgs(arguments))
    },

    success : function () {
      console.log(this.all() + c.green('Success: ') + this.parseArgs(arguments))
    }
}
