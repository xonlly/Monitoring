"use strict";

const Socket = require('../collector/socket')
const Log = require('../utils/log')

class Server extends Socket {

  constructor( options ) {
    super( options )

    /* Check for Security */
    if (options.key == '456DAde486qD684de6') {
      Log.warn('this key is not secure !')
    }
  }

}

module.exports = Server;
