"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
CSV Generate - main module

Please look at the [project documentation](https://csv.js.org/generate/) for
additional information.
*/
var stream = require('stream');

var util = require('util');

module.exports = function () {
  var options;
  var callback;

  if (arguments.length === 2) {
    options = arguments[0];
    callback = arguments[1];
  } else if (arguments.length === 1) {
    if (typeof arguments[0] === 'function') {
      options = {};
      callback = arguments[0];
    } else {
      options = arguments[0];
    }
  } else if (arguments.length === 0) {
    options = {};
  }

  var generator = new Generator(options);

  if (callback) {
    var data = [];
    generator.on('readable', function () {
      var d;

      while (d = generator.read()) {
        data.push(d);
      }
    });
    generator.on('error', callback);
    generator.on('end', function () {
      if (generator.options.objectMode) {
        callback(null, data);
      } else {
        if (generator.options.encoding) {
          callback(null, data.join(''));
        } else {
          callback(null, Buffer.concat(data));
        }
      }
    });
  }

  return generator;
};

Generator = function (_Generator) {
  function Generator() {
    return _Generator.apply(this, arguments);
  }

  Generator.toString = function () {
    return _Generator.toString();
  };

  return Generator;
}(function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // Convert Stream Readable options if underscored
  if (options.high_water_mark) {
    options.highWaterMark = options.high_water_mark;
  }

  if (options.object_mode) {
    options.objectMode = options.object_mode;
  } // Call parent constructor


  stream.Readable.call(this, options); // Clone and camelize options

  this.options = {};

  for (var k in options) {
    this.options[Generator.camelize(k)] = options[k];
  } // Normalize options


  var dft = {
    columns: 8,
    delimiter: ',',
    duration: null,
    encoding: null,
    end: null,
    eof: false,
    fixedSize: false,
    length: -1,
    maxWordLength: 16,
    rowDelimiter: '\n',
    seed: false,
    sleep: 0
  };

  for (var _k in dft) {
    if (this.options[_k] === undefined) {
      this.options[_k] = dft[_k];
    }
  } // Default values


  if (this.options.eof === true) {
    this.options.eof = this.options.rowDelimiter;
  } // State


  this._ = {
    start_time: this.options.duration ? Date.now() : null,
    fixed_size_buffer: '',
    count_written: 0,
    count_created: 0
  };

  if (typeof this.options.columns === 'number') {
    this.options.columns = new Array(this.options.columns);
  }

  var accepted_header_types = Object.keys(Generator).filter(function (t) {
    return !['super_', 'camelize'].includes(t);
  });

  for (var i = 0; i < this.options.columns.length; i++) {
    var v = this.options.columns[i] || 'ascii';

    if (typeof v === 'string') {
      if (!accepted_header_types.includes(v)) {
        throw Error("Invalid column type: got \"".concat(v, "\", default values are ").concat(JSON.stringify(accepted_header_types)));
      }

      this.options.columns[i] = Generator[v];
    }
  }

  return this;
});

util.inherits(Generator, stream.Readable); // Export the class

module.exports.Generator = Generator; // Generate a random number between 0 and 1 with 2 decimals. The function is idempotent if it detect the "seed" option.

Generator.prototype.random = function () {
  if (this.options.seed) {
    return this.options.seed = this.options.seed * Math.PI * 100 % 100 / 100;
  } else {
    return Math.random();
  }
}; // Stop the generation.


Generator.prototype.end = function () {
  this.push(null);
}; // Put new data into the read queue.


Generator.prototype._read = function (size) {
  var _this = this;

  // Already started
  var data = [];
  var length = this._.fixed_size_buffer.length;

  if (length !== 0) {
    data.push(this._.fixed_size_buffer);
  }

  var _loop = function _loop() {
    // Time for some rest: flush first and stop later
    if (_this._.count_created === _this.options.length || _this.options.end && Date.now() > _this.options.end || _this.options.duration && Date.now() > _this._.start_time + _this.options.duration) {
      // Flush
      if (data.length) {
        if (_this.options.objectMode) {
          var _iterator = _createForOfIteratorHelper(data),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var _line = _step.value;

              _this.__push(_line);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } else {
          _this.__push(data.join('') + (_this.options.eof ? _this.options.eof : ''));
        }
      } // Stop


      return {
        v: _this.push(null)
      };
    } // Create the line


    var line = [];
    var lineLength = void 0;

    _this.options.columns.forEach(function (fn) {
      line.push(fn(_this));
    }); // for(const header in this.options.columns){
    //   // Create the field
    //   line.push(header(this))
    // }
    // Obtain line length


    if (_this.options.objectMode) {
      lineLength = 0;

      var _iterator2 = _createForOfIteratorHelper(line),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var column = _step2.value;
          lineLength += column.length;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    } else {
      // Stringify the line
      line = (_this._.count_created === 0 ? '' : _this.options.rowDelimiter) + line.join(_this.options.delimiter);
      lineLength = line.length;
    }

    _this._.count_created++;

    if (length + lineLength > size) {
      if (_this.options.objectMode) {
        data.push(line);

        var _iterator3 = _createForOfIteratorHelper(data),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _line2 = _step3.value;

            _this.__push(_line2);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      } else {
        if (_this.options.fixedSize) {
          _this._.fixed_size_buffer = line.substr(size - length);
          data.push(line.substr(0, size - length));
        } else {
          data.push(line);
        }

        _this.__push(data.join(''));
      }

      return {
        v: void 0
      };
    }

    length += lineLength;
    data.push(line);
  };

  while (true) {
    var _ret = _loop();

    if (_typeof(_ret) === "object") return _ret.v;
  }
}; // Put new data into the read queue.


Generator.prototype.__push = function (record) {
  var _this2 = this;

  this._.count_written++;

  if (this.options.sleep > 0) {
    setTimeout(function () {
      _this2.push(record);
    }, this.options.sleep);
  } else {
    this.push(record);
  }
}; // Generate an ASCII value.


Generator.ascii = function (gen) {
  // Column
  var column = [];
  var nb_chars = Math.ceil(gen.random() * gen.options.maxWordLength);

  for (var i = 0; i < nb_chars; i++) {
    var _char = Math.floor(gen.random() * 32);

    column.push(String.fromCharCode(_char + (_char < 16 ? 65 : 97 - 16)));
  }

  return column.join('');
}; // Generate an integer value.


Generator["int"] = function (gen) {
  return Math.floor(gen.random() * Math.pow(2, 52));
}; // Generate an boolean value.


Generator.bool = function (gen) {
  return Math.floor(gen.random() * 2);
}; // Camelize option properties


Generator.camelize = function (str) {
  return str.replace(/_([a-z])/gi, function (_, match, index) {
    return match.toUpperCase();
  });
};