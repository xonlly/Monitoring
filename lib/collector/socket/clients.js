"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rooms = require('./rooms');
var Log = require('../../utils/log');

var Clients = (function (_Rooms) {
  _inherits(Clients, _Rooms);

  function Clients(options, socketio) {
    _classCallCheck(this, Clients);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Clients).call(this, options, socketio));

    _this.options = options;
    return _this;
  }

  _createClass(Clients, [{
    key: 'connection',
    value: function connection(socket) {
      var _this2 = this;

      socket.on('auth', function (key) {
        if (_this2.options.key == key) {
          socket.isAuth = true;
          socket.emit('isAuth', { success: true });
        } else {
          socket.isAuth = false;
          socket.emit('isAuth', { success: false, error: 'KEY_IS_NOT_VALID' });
        }
      });

      /* if user need change room */
      socket.on('room', function (data) {

        if (!_this2.isAuth(socket)) return;

        Log.info('User join room:', data);

        switch (data) {
          case 'server':

            socket.join('servers');
            _this2.initServer(socket);

            break;
          case 'client':

            socket.join('clients');
            _this2.initClient(socket);

            break;
          default:

        }
      });
    }
  }]);

  return Clients;
})(Rooms);

module.exports = Clients;