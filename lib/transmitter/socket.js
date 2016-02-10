"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var regexDomain = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
var regexIp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

var os = require('../collector/monitoring/os');

var SocketClient = function (_os) {
  _inherits(SocketClient, _os);

  function SocketClient(options) {
    _classCallCheck(this, SocketClient);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SocketClient).call(this, options));

    var dom = options.host || options.server || '127.0.0.1';

    if (!_this.isDomain(dom)) {
      console.log('Fail on check domain, the domain is not valid', dom);
    }

    var url = (options.https ? 'https' : 'http') + '://' + dom + ':' + (options.port || 8080);

    var socket = require('socket.io-client')(url);

    _this.socket = socket;

    return _this;
  }

  _createClass(SocketClient, [{
    key: 'isDomain',
    value: function isDomain(dom) {
      if (regexDomain.test(dom) || regexIp.test(dom)) return true;else return false;
    }
  }, {
    key: 'get',
    value: function get() {
      return this.socket;
    }
  }]);

  return SocketClient;
}(os);

module.exports = SocketClient;