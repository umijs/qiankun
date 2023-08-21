"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ResizeableBuffer = /*#__PURE__*/function () {
  function ResizeableBuffer() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

    _classCallCheck(this, ResizeableBuffer);

    this.size = size;
    this.length = 0;
    this.buf = Buffer.alloc(size);
  }

  _createClass(ResizeableBuffer, [{
    key: "prepend",
    value: function prepend(val) {
      if (Buffer.isBuffer(val)) {
        var length = this.length + val.length;

        if (length >= this.size) {
          this.resize();

          if (length >= this.size) {
            throw Error('INVALID_BUFFER_STATE');
          }
        }

        var buf = this.buf;
        this.buf = Buffer.alloc(this.size);
        val.copy(this.buf, 0);
        buf.copy(this.buf, val.length);
        this.length += val.length;
      } else {
        var _length = this.length++;

        if (_length === this.size) {
          this.resize();
        }

        var _buf = this.clone();

        this.buf[0] = val;

        _buf.copy(this.buf, 1, 0, _length);
      }
    }
  }, {
    key: "append",
    value: function append(val) {
      var length = this.length++;

      if (length === this.size) {
        this.resize();
      }

      this.buf[length] = val;
    }
  }, {
    key: "clone",
    value: function clone() {
      return Buffer.from(this.buf.slice(0, this.length));
    }
  }, {
    key: "resize",
    value: function resize() {
      var length = this.length;
      this.size = this.size * 2;
      var buf = Buffer.alloc(this.size);
      this.buf.copy(buf, 0, 0, length);
      this.buf = buf;
    }
  }, {
    key: "toString",
    value: function toString(encoding) {
      if (encoding) {
        return this.buf.slice(0, this.length).toString(encoding);
      } else {
        return Uint8Array.prototype.slice.call(this.buf.slice(0, this.length));
      }
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.toString('utf8');
    }
  }, {
    key: "reset",
    value: function reset() {
      this.length = 0;
    }
  }]);

  return ResizeableBuffer;
}();

module.exports = ResizeableBuffer;