'use strict';

const chunk         = require('blow-chunks');
const child_process = require('child_process');
const Log           = require('../../utils/log');
const os            = require('os');

module.exports = function(ifaces, tick) {
  var process = false;
  switch (os.platform()) {
    case 'win32':
      process = __dirname + '/win32/ifstat.exe'
      break;
    case 'linux':
      process = 'ifstat'
      break;
    default:
      return Log.error('Os '+os.platform()+' not supported.')
  }

  var ifstat = child_process.spawn(process, [
    '-w', '-n'/*, '-i', ifaces.join(',')*/
  ]), firstTick = true;

  ifstat.stdout.on('data', function(data) {
    if (!firstTick) {
      return tick(
        chunk(
          data.toString().trim().split(/\s/g).filter(function(line) {
            return line !== '';
          }), 2
        )
      );
    }
    firstTick = false;
  });

  ifstat.stderr.on('data', function(data) {
    Log.error('ifstat error:', data.toString());
  });

  ifstat.on('close', function(code) {
    Log.error('ifstat closed with code:', code);
  });
};
