'use strict';

var chunk = require('blow-chunks');
var child_process = require('child_process');
var Log = require('../../utils/log');
var os = require('os');
var Download = require('download');
var extract = require('extract-zip');
var fs = require('fs');

module.exports = function (ifaces, tick) {
  var process = false;
  switch (os.platform()) {
    case 'win32':
      process = __dirname + '/win32/ifstat-1.1-win32/ifstat.exe';
      break;
    case 'darwin':
    case 'linux':
      process = 'ifstat';
      break;
    default:
      return Log.err('Os ' + os.platform() + ' not supported.');
  }

  var ifstatExist = function ifstatExist() {

    return new Promise(function (resolve, fail) {

      if (os.platform() == 'win32') {

        if (fs.existsSync(process)) {
          resolve();
          return;
        }

        new Download({ mode: '755' }).get('http://gael.roualland.free.fr/ifstat/ifstat-1.1-win32.zip').dest(__dirname + '/win32').run(function (err, files) {
          if (err) {
            Log.err(err);
            fail();
            return;
          }

          Log.success('ifstat downloaded.');

          extract(__dirname + '/win32/ifstat-1.1-win32.zip', { dir: __dirname + '/win32' }, function (err) {
            if (err) {
              Log.err(err);
              fail();
              return;
            }
            Log.success('File is extracted');
            resolve();
          });
        });

        return;
      }

      child_process.exec('command -v ifstat', function (error, stdout, stderr) {
        if (stdout == '') {
          return fail();
        } else {
          return resolve();
        }
      });
    });
  };

  ifstatExist().then(function () {

    var ifstat = child_process.spawn(process, ['-w', '-n' /*, '-i', ifaces.join(',')*/
    ]),
        firstTick = true;

    ifstat.stdout.on('data', function (data) {
      if (!firstTick) {
        return tick(chunk(data.toString().trim().split(/\s/g).filter(function (line) {
          return line !== '';
        }), 2));
      }
      firstTick = false;
    });

    ifstat.stderr.on('data', function (data) {
      Log.err('ifstat error:', data.toString());
    });

    ifstat.on('close', function (code) {
      Log.err('ifstat closed with code:', code);
    });
  }).catch(function () {
    Log.warn('ifstat is not installed on system.');
  });
};