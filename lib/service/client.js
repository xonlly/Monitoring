"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SocketClient = require('../transmitter/socket');
var Log = require('../utils/log');

var Client = (function (_SocketClient) {
  _inherits(Client, _SocketClient);

  function Client(options) {
    _classCallCheck(this, Client);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Client).call(this, options));

    var socket = _this.get();

    _this.options = {
      connected: false
    };

    setInterval(function () {
      if (!_this.options.connected) return false;

      socket.emit('update', _this.osGetAll());
    }, 1000);

    socket.on('connect', function () {
      _this.options.connected = true;
      socket.emit('auth', options.key);
    });

    socket.on('isAuth', function (data) {
      if (!data.success) {
        Log.err(data.error);
      } else {
        // If user is auth on login, i join the room for send infos to server
        socket.emit('room', 'server');
        Log.success('You are connected to master');
      }
    });

    socket.on('disconnect', function () {
      _this.options.connected = false;
      Log.err('You are disconnect from master !');
    });
    return _this;
  }

  return Client;
})(SocketClient);

module.exports = Client;