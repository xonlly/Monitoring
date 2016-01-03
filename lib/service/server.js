"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Socket = require('../collector/socket');
var Log = require('../utils/log');

var Server = (function (_Socket) {
  _inherits(Server, _Socket);

  function Server(options) {
    _classCallCheck(this, Server);

    /* Check for Security */

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Server).call(this, options));

    if (options.key == '456DAde486qD684de6') {
      Log.warn('this key is not secure !');
    }
    return _this;
  }

  return Server;
})(Socket);

module.exports = Server;

/* Temp demo /* */

/* */