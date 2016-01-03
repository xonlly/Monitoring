"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Clients = require('./socket/clients');

var Socket = function Socket(options) {
    var _this = this;

    _classCallCheck(this, Socket);

    var SocketIo = require('socket.io')(options.port || 8080);

    this.clients = new Clients(options, SocketIo);

    SocketIo.on('connection', function (socket) {

        _this.clients.connection(socket);

        socket.on('disconnect', function () {
            return _this.clients.disconnect(socket);
        });
    });
};

module.exports = Socket;