"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Log = require('../../utils/log');

var Rooms = (function () {
  function Rooms(options, socketio) {
    var _this = this;

    _classCallCheck(this, Rooms);

    // ['initServers', 'initClients'].forEach((k) => this[k]( socketio ))
    this.io = socketio;
    var io = this.io;
    this.servers = {};

    setInterval(function () {
      // Send to all clients all servers data.
      io.sockets.to('clients').emit('update', {
        servers: _this.servers,
        datas: {}
      });
    }, 1000);
  }

  /**
   * For check if user is auth to run.
   */

  _createClass(Rooms, [{
    key: 'isAuth',
    value: function isAuth(socket) {
      if (socket.isAuth) {
        return true;
      } else {
        Log.warn('User is not auth to exec this function');
        socket.emit('isAuth', { success: false, error: 'YOU_DONT_HAVE_PERMS' });
        return false;
      }
    }

    /**
     * Init la room pour les serveurs
     */

  }, {
    key: 'initServer',
    value: function initServer(socket) {
      var _this2 = this;

      var io = this.io;

      /* Server send new infos */
      socket.on('update', function (data) {
        // Socket save Name.
        socket.nickname = data.name;

        // Update & create data to all servers.
        _this2.servers[data.name] = { id: socket.id, os: data, online: true };
      });
    }
  }, {
    key: 'disconnect',
    value: function disconnect(socket) {
      var io = this.io;

      Log.info('Disconnect ', socket.nickname);

      // Is not a server
      if (!this.servers[socket.nickname]) return;

      this.servers[socket.nickname].online = false;
    }

    /**
     * Init la room pour les clients
     */

  }, {
    key: 'initClient',
    value: function initClient(socket) {
      var io = this.io;

      Log.info('New client, total ' + Object.keys(io.sockets.adapter.rooms.clients).length);
    }
  }, {
    key: 'sendToClients',
    value: function sendToClients() {}
  }]);

  return Rooms;
})();

module.exports = Rooms;