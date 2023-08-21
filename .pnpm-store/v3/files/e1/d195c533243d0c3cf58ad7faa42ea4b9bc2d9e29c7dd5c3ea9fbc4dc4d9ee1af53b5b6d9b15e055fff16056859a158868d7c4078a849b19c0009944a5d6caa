"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
Stream Transform - sync module

Please look at the [project documentation](https://csv.js.org/transform/) for
additional information.
*/
var transform = require('.');

var _require = require('mixme'),
    clone = _require.clone;

module.exports = function () {
  // Import arguments normalization
  var handler, callback;
  var options = {};

  for (i in arguments) {
    var argument = arguments[i];

    var type = _typeof(argument);

    if (argument === null) {
      type = 'null';
    } else if (type === 'object' && Array.isArray(argument)) {
      type = 'array';
    }

    if (type === 'array') {
      records = argument;
    } else if (type === 'object') {
      options = clone(argument);
    } else if (type === 'function') {
      if (handler && i === arguments.length - 1) {
        callback = argument;
      } else {
        handler = argument;
      }
    } else if (type !== 'null') {
      throw new Error("Invalid Arguments: got ".concat(JSON.stringify(argument), " at position ").concat(i));
    }
  } // Validate arguments


  var expected_handler_length = 1;

  if (options.params) {
    expected_handler_length++;
  }

  if (handler.length > expected_handler_length) {
    throw Error('Invalid Handler: only synchonous handlers are supported');
  } // Start transformation


  var chunks = [];
  var transformer = new transform.Transformer(options, handler);

  transformer.push = function (chunk) {
    chunks.push(chunk);
  };

  var _iterator = _createForOfIteratorHelper(records),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var record = _step.value;

      transformer._transform(record, null, function () {});
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return chunks;
};