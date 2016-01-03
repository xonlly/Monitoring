'use strict'

/* Use lib directory for more compatibility */
var Client = require('./lib/service/client');

module.exports = function ( options ) {

  new Client({
    server: options.host || '127.0.0.1',
    port: options.port || 8156,
    key: options.key || '456DAde486qD684de6'
  });

}
