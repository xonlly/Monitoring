"use strict"

const regexDomain = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/
const regexIp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/

class SocketClient {

  constructor( options ) {

    const dom = (options.host || '127.0.0.1')

    if (!this.isDomain(dom)) {
      console.log('Fail on check domain, the domain is not valid', dom)
    }

    const url = (options.https ? 'https' : 'http') + '://' + dom + ':' + (options.port || 8080)

    const socket = require('socket.io-client')(url)

    this.socket = socket

  }

  isDomain(dom) {
    if (regexDomain.test(dom) || regexIp.test(dom))
      return true
    else
      return false
  }

  get() {
    return this.socket
  }

}

module.exports = SocketClient
