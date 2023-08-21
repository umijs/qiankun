"use strict";

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/*
CSV Parse

Please look at the [project documentation](https://csv.js.org/parse/) for
additional information.
*/
var _require = require('stream'),
    Transform = _require.Transform;

var ResizeableBuffer = require('./ResizeableBuffer'); // white space characters
// https://en.wikipedia.org/wiki/Whitespace_character
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes#Types
// \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff


var tab = 9;
var nl = 10; // \n, 0x0A in hexadecimal, 10 in decimal

var np = 12;
var cr = 13; // \r, 0x0D in hexadécimal, 13 in decimal

var space = 32;
var boms = {
  // Note, the following are equals:
  // Buffer.from("\ufeff")
  // Buffer.from([239, 187, 191])
  // Buffer.from('EFBBBF', 'hex')
  'utf8': Buffer.from([239, 187, 191]),
  // Note, the following are equals:
  // Buffer.from "\ufeff", 'utf16le
  // Buffer.from([255, 254])
  'utf16le': Buffer.from([255, 254])
};

var Parser = /*#__PURE__*/function (_Transform) {
  _inherits(Parser, _Transform);

  var _super = _createSuper(Parser);

  function Parser() {
    var _this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Parser);

    _this = _super.call(this, _objectSpread(_objectSpread(_objectSpread({}, {
      readableObjectMode: true
    }), opts), {}, {
      encoding: null
    }));
    _this.__originalOptions = opts;

    _this.__normalizeOptions(opts);

    return _this;
  }

  _createClass(Parser, [{
    key: "__normalizeOptions",
    value: function __normalizeOptions(opts) {
      var options = {}; // Merge with user options

      for (var opt in opts) {
        options[underscore(opt)] = opts[opt];
      } // Normalize option `encoding`
      // Note: defined first because other options depends on it
      // to convert chars/strings into buffers.


      if (options.encoding === undefined || options.encoding === true) {
        options.encoding = 'utf8';
      } else if (options.encoding === null || options.encoding === false) {
        options.encoding = null;
      } else if (typeof options.encoding !== 'string' && options.encoding !== null) {
        throw new CsvError('CSV_INVALID_OPTION_ENCODING', ['Invalid option encoding:', 'encoding must be a string or null to return a buffer,', "got ".concat(JSON.stringify(options.encoding))], options);
      } // Normalize option `bom`


      if (options.bom === undefined || options.bom === null || options.bom === false) {
        options.bom = false;
      } else if (options.bom !== true) {
        throw new CsvError('CSV_INVALID_OPTION_BOM', ['Invalid option bom:', 'bom must be true,', "got ".concat(JSON.stringify(options.bom))], options);
      } // Normalize option `cast`


      var fnCastField = null;

      if (options.cast === undefined || options.cast === null || options.cast === false || options.cast === '') {
        options.cast = undefined;
      } else if (typeof options.cast === 'function') {
        fnCastField = options.cast;
        options.cast = true;
      } else if (options.cast !== true) {
        throw new CsvError('CSV_INVALID_OPTION_CAST', ['Invalid option cast:', 'cast must be true or a function,', "got ".concat(JSON.stringify(options.cast))], options);
      } // Normalize option `cast_date`


      if (options.cast_date === undefined || options.cast_date === null || options.cast_date === false || options.cast_date === '') {
        options.cast_date = false;
      } else if (options.cast_date === true) {
        options.cast_date = function (value) {
          var date = Date.parse(value);
          return !isNaN(date) ? new Date(date) : value;
        };
      } else {
        throw new CsvError('CSV_INVALID_OPTION_CAST_DATE', ['Invalid option cast_date:', 'cast_date must be true or a function,', "got ".concat(JSON.stringify(options.cast_date))], options);
      } // Normalize option `columns`


      var fnFirstLineToHeaders = null;

      if (options.columns === true) {
        // Fields in the first line are converted as-is to columns
        fnFirstLineToHeaders = undefined;
      } else if (typeof options.columns === 'function') {
        fnFirstLineToHeaders = options.columns;
        options.columns = true;
      } else if (Array.isArray(options.columns)) {
        options.columns = normalizeColumnsArray(options.columns);
      } else if (options.columns === undefined || options.columns === null || options.columns === false) {
        options.columns = false;
      } else {
        throw new CsvError('CSV_INVALID_OPTION_COLUMNS', ['Invalid option columns:', 'expect an array, a function or true,', "got ".concat(JSON.stringify(options.columns))], options);
      } // Normalize option `columns_duplicates_to_array`


      if (options.columns_duplicates_to_array === undefined || options.columns_duplicates_to_array === null || options.columns_duplicates_to_array === false) {
        options.columns_duplicates_to_array = false;
      } else if (options.columns_duplicates_to_array !== true) {
        throw new CsvError('CSV_INVALID_OPTION_COLUMNS_DUPLICATES_TO_ARRAY', ['Invalid option columns_duplicates_to_array:', 'expect an boolean,', "got ".concat(JSON.stringify(options.columns_duplicates_to_array))], options);
      } else if (options.columns === false) {
        throw new CsvError('CSV_INVALID_OPTION_COLUMNS_DUPLICATES_TO_ARRAY', ['Invalid option columns_duplicates_to_array:', 'the `columns` mode must be activated.'], options);
      } // Normalize option `comment`


      if (options.comment === undefined || options.comment === null || options.comment === false || options.comment === '') {
        options.comment = null;
      } else {
        if (typeof options.comment === 'string') {
          options.comment = Buffer.from(options.comment, options.encoding);
        }

        if (!Buffer.isBuffer(options.comment)) {
          throw new CsvError('CSV_INVALID_OPTION_COMMENT', ['Invalid option comment:', 'comment must be a buffer or a string,', "got ".concat(JSON.stringify(options.comment))], options);
        }
      } // Normalize option `delimiter`


      var delimiter_json = JSON.stringify(options.delimiter);
      if (!Array.isArray(options.delimiter)) options.delimiter = [options.delimiter];

      if (options.delimiter.length === 0) {
        throw new CsvError('CSV_INVALID_OPTION_DELIMITER', ['Invalid option delimiter:', 'delimiter must be a non empty string or buffer or array of string|buffer,', "got ".concat(delimiter_json)], options);
      }

      options.delimiter = options.delimiter.map(function (delimiter) {
        if (delimiter === undefined || delimiter === null || delimiter === false) {
          return Buffer.from(',', options.encoding);
        }

        if (typeof delimiter === 'string') {
          delimiter = Buffer.from(delimiter, options.encoding);
        }

        if (!Buffer.isBuffer(delimiter) || delimiter.length === 0) {
          throw new CsvError('CSV_INVALID_OPTION_DELIMITER', ['Invalid option delimiter:', 'delimiter must be a non empty string or buffer or array of string|buffer,', "got ".concat(delimiter_json)], options);
        }

        return delimiter;
      }); // Normalize option `escape`

      if (options.escape === undefined || options.escape === true) {
        options.escape = Buffer.from('"', options.encoding);
      } else if (typeof options.escape === 'string') {
        options.escape = Buffer.from(options.escape, options.encoding);
      } else if (options.escape === null || options.escape === false) {
        options.escape = null;
      }

      if (options.escape !== null) {
        if (!Buffer.isBuffer(options.escape)) {
          throw new Error("Invalid Option: escape must be a buffer, a string or a boolean, got ".concat(JSON.stringify(options.escape)));
        }
      } // Normalize option `from`


      if (options.from === undefined || options.from === null) {
        options.from = 1;
      } else {
        if (typeof options.from === 'string' && /\d+/.test(options.from)) {
          options.from = parseInt(options.from);
        }

        if (Number.isInteger(options.from)) {
          if (options.from < 0) {
            throw new Error("Invalid Option: from must be a positive integer, got ".concat(JSON.stringify(opts.from)));
          }
        } else {
          throw new Error("Invalid Option: from must be an integer, got ".concat(JSON.stringify(options.from)));
        }
      } // Normalize option `from_line`


      if (options.from_line === undefined || options.from_line === null) {
        options.from_line = 1;
      } else {
        if (typeof options.from_line === 'string' && /\d+/.test(options.from_line)) {
          options.from_line = parseInt(options.from_line);
        }

        if (Number.isInteger(options.from_line)) {
          if (options.from_line <= 0) {
            throw new Error("Invalid Option: from_line must be a positive integer greater than 0, got ".concat(JSON.stringify(opts.from_line)));
          }
        } else {
          throw new Error("Invalid Option: from_line must be an integer, got ".concat(JSON.stringify(opts.from_line)));
        }
      } // Normalize options `ignore_last_delimiters`


      if (options.ignore_last_delimiters === undefined || options.ignore_last_delimiters === null) {
        options.ignore_last_delimiters = false;
      } else if (typeof options.ignore_last_delimiters === 'number') {
        options.ignore_last_delimiters = Math.floor(options.ignore_last_delimiters);

        if (options.ignore_last_delimiters === 0) {
          options.ignore_last_delimiters = false;
        }
      } else if (typeof options.ignore_last_delimiters !== 'boolean') {
        throw new CsvError('CSV_INVALID_OPTION_IGNORE_LAST_DELIMITERS', ['Invalid option `ignore_last_delimiters`:', 'the value must be a boolean value or an integer,', "got ".concat(JSON.stringify(options.ignore_last_delimiters))], options);
      }

      if (options.ignore_last_delimiters === true && options.columns === false) {
        throw new CsvError('CSV_IGNORE_LAST_DELIMITERS_REQUIRES_COLUMNS', ['The option `ignore_last_delimiters`', 'requires the activation of the `columns` option'], options);
      } // Normalize option `info`


      if (options.info === undefined || options.info === null || options.info === false) {
        options.info = false;
      } else if (options.info !== true) {
        throw new Error("Invalid Option: info must be true, got ".concat(JSON.stringify(options.info)));
      } // Normalize option `max_record_size`


      if (options.max_record_size === undefined || options.max_record_size === null || options.max_record_size === false) {
        options.max_record_size = 0;
      } else if (Number.isInteger(options.max_record_size) && options.max_record_size >= 0) {// Great, nothing to do
      } else if (typeof options.max_record_size === 'string' && /\d+/.test(options.max_record_size)) {
        options.max_record_size = parseInt(options.max_record_size);
      } else {
        throw new Error("Invalid Option: max_record_size must be a positive integer, got ".concat(JSON.stringify(options.max_record_size)));
      } // Normalize option `objname`


      if (options.objname === undefined || options.objname === null || options.objname === false) {
        options.objname = undefined;
      } else if (Buffer.isBuffer(options.objname)) {
        if (options.objname.length === 0) {
          throw new Error("Invalid Option: objname must be a non empty buffer");
        }

        if (options.encoding === null) {// Don't call `toString`, leave objname as a buffer
        } else {
          options.objname = options.objname.toString(options.encoding);
        }
      } else if (typeof options.objname === 'string') {
        if (options.objname.length === 0) {
          throw new Error("Invalid Option: objname must be a non empty string");
        } // Great, nothing to do

      } else {
        throw new Error("Invalid Option: objname must be a string or a buffer, got ".concat(options.objname));
      } // Normalize option `on_record`


      if (options.on_record === undefined || options.on_record === null) {
        options.on_record = undefined;
      } else if (typeof options.on_record !== 'function') {
        throw new CsvError('CSV_INVALID_OPTION_ON_RECORD', ['Invalid option `on_record`:', 'expect a function,', "got ".concat(JSON.stringify(options.on_record))], options);
      } // Normalize option `quote`


      if (options.quote === null || options.quote === false || options.quote === '') {
        options.quote = null;
      } else {
        if (options.quote === undefined || options.quote === true) {
          options.quote = Buffer.from('"', options.encoding);
        } else if (typeof options.quote === 'string') {
          options.quote = Buffer.from(options.quote, options.encoding);
        }

        if (!Buffer.isBuffer(options.quote)) {
          throw new Error("Invalid Option: quote must be a buffer or a string, got ".concat(JSON.stringify(options.quote)));
        }
      } // Normalize option `raw`


      if (options.raw === undefined || options.raw === null || options.raw === false) {
        options.raw = false;
      } else if (options.raw !== true) {
        throw new Error("Invalid Option: raw must be true, got ".concat(JSON.stringify(options.raw)));
      } // Normalize option `record_delimiter`


      if (!options.record_delimiter) {
        options.record_delimiter = [];
      } else if (!Array.isArray(options.record_delimiter)) {
        options.record_delimiter = [options.record_delimiter];
      }

      options.record_delimiter = options.record_delimiter.map(function (rd) {
        if (typeof rd === 'string') {
          rd = Buffer.from(rd, options.encoding);
        }

        return rd;
      }); // Normalize option `relax`

      if (typeof options.relax === 'boolean') {// Great, nothing to do
      } else if (options.relax === undefined || options.relax === null) {
        options.relax = false;
      } else {
        throw new Error("Invalid Option: relax must be a boolean, got ".concat(JSON.stringify(options.relax)));
      } // Normalize option `relax_column_count`


      if (typeof options.relax_column_count === 'boolean') {// Great, nothing to do
      } else if (options.relax_column_count === undefined || options.relax_column_count === null) {
        options.relax_column_count = false;
      } else {
        throw new Error("Invalid Option: relax_column_count must be a boolean, got ".concat(JSON.stringify(options.relax_column_count)));
      }

      if (typeof options.relax_column_count_less === 'boolean') {// Great, nothing to do
      } else if (options.relax_column_count_less === undefined || options.relax_column_count_less === null) {
        options.relax_column_count_less = false;
      } else {
        throw new Error("Invalid Option: relax_column_count_less must be a boolean, got ".concat(JSON.stringify(options.relax_column_count_less)));
      }

      if (typeof options.relax_column_count_more === 'boolean') {// Great, nothing to do
      } else if (options.relax_column_count_more === undefined || options.relax_column_count_more === null) {
        options.relax_column_count_more = false;
      } else {
        throw new Error("Invalid Option: relax_column_count_more must be a boolean, got ".concat(JSON.stringify(options.relax_column_count_more)));
      } // Normalize option `skip_empty_lines`


      if (typeof options.skip_empty_lines === 'boolean') {// Great, nothing to do
      } else if (options.skip_empty_lines === undefined || options.skip_empty_lines === null) {
        options.skip_empty_lines = false;
      } else {
        throw new Error("Invalid Option: skip_empty_lines must be a boolean, got ".concat(JSON.stringify(options.skip_empty_lines)));
      } // Normalize option `skip_lines_with_empty_values`


      if (typeof options.skip_lines_with_empty_values === 'boolean') {// Great, nothing to do
      } else if (options.skip_lines_with_empty_values === undefined || options.skip_lines_with_empty_values === null) {
        options.skip_lines_with_empty_values = false;
      } else {
        throw new Error("Invalid Option: skip_lines_with_empty_values must be a boolean, got ".concat(JSON.stringify(options.skip_lines_with_empty_values)));
      } // Normalize option `skip_lines_with_error`


      if (typeof options.skip_lines_with_error === 'boolean') {// Great, nothing to do
      } else if (options.skip_lines_with_error === undefined || options.skip_lines_with_error === null) {
        options.skip_lines_with_error = false;
      } else {
        throw new Error("Invalid Option: skip_lines_with_error must be a boolean, got ".concat(JSON.stringify(options.skip_lines_with_error)));
      } // Normalize option `rtrim`


      if (options.rtrim === undefined || options.rtrim === null || options.rtrim === false) {
        options.rtrim = false;
      } else if (options.rtrim !== true) {
        throw new Error("Invalid Option: rtrim must be a boolean, got ".concat(JSON.stringify(options.rtrim)));
      } // Normalize option `ltrim`


      if (options.ltrim === undefined || options.ltrim === null || options.ltrim === false) {
        options.ltrim = false;
      } else if (options.ltrim !== true) {
        throw new Error("Invalid Option: ltrim must be a boolean, got ".concat(JSON.stringify(options.ltrim)));
      } // Normalize option `trim`


      if (options.trim === undefined || options.trim === null || options.trim === false) {
        options.trim = false;
      } else if (options.trim !== true) {
        throw new Error("Invalid Option: trim must be a boolean, got ".concat(JSON.stringify(options.trim)));
      } // Normalize options `trim`, `ltrim` and `rtrim`


      if (options.trim === true && opts.ltrim !== false) {
        options.ltrim = true;
      } else if (options.ltrim !== true) {
        options.ltrim = false;
      }

      if (options.trim === true && opts.rtrim !== false) {
        options.rtrim = true;
      } else if (options.rtrim !== true) {
        options.rtrim = false;
      } // Normalize option `to`


      if (options.to === undefined || options.to === null) {
        options.to = -1;
      } else {
        if (typeof options.to === 'string' && /\d+/.test(options.to)) {
          options.to = parseInt(options.to);
        }

        if (Number.isInteger(options.to)) {
          if (options.to <= 0) {
            throw new Error("Invalid Option: to must be a positive integer greater than 0, got ".concat(JSON.stringify(opts.to)));
          }
        } else {
          throw new Error("Invalid Option: to must be an integer, got ".concat(JSON.stringify(opts.to)));
        }
      } // Normalize option `to_line`


      if (options.to_line === undefined || options.to_line === null) {
        options.to_line = -1;
      } else {
        if (typeof options.to_line === 'string' && /\d+/.test(options.to_line)) {
          options.to_line = parseInt(options.to_line);
        }

        if (Number.isInteger(options.to_line)) {
          if (options.to_line <= 0) {
            throw new Error("Invalid Option: to_line must be a positive integer greater than 0, got ".concat(JSON.stringify(opts.to_line)));
          }
        } else {
          throw new Error("Invalid Option: to_line must be an integer, got ".concat(JSON.stringify(opts.to_line)));
        }
      }

      this.info = {
        bytes: 0,
        comment_lines: 0,
        empty_lines: 0,
        invalid_field_length: 0,
        lines: 1,
        records: 0
      };
      this.options = options;
      this.state = {
        bomSkipped: false,
        bufBytesStart: 0,
        castField: fnCastField,
        commenting: false,
        // Current error encountered by a record
        error: undefined,
        enabled: options.from_line === 1,
        escaping: false,
        // escapeIsQuote: options.escape === options.quote,
        escapeIsQuote: Buffer.isBuffer(options.escape) && Buffer.isBuffer(options.quote) && Buffer.compare(options.escape, options.quote) === 0,
        // columns can be `false`, `true`, `Array`
        expectedRecordLength: Array.isArray(options.columns) ? options.columns.length : undefined,
        field: new ResizeableBuffer(20),
        firstLineToHeaders: fnFirstLineToHeaders,
        needMoreDataSize: Math.max.apply(Math, [// Skip if the remaining buffer smaller than comment
        options.comment !== null ? options.comment.length : 0].concat(_toConsumableArray(options.delimiter.map(function (delimiter) {
          return delimiter.length;
        })), [// Skip if the remaining buffer can be escape sequence
        options.quote !== null ? options.quote.length : 0])),
        previousBuf: undefined,
        quoting: false,
        stop: false,
        rawBuffer: new ResizeableBuffer(100),
        record: [],
        recordHasError: false,
        record_length: 0,
        recordDelimiterMaxLength: options.record_delimiter.length === 0 ? 2 : Math.max.apply(Math, _toConsumableArray(options.record_delimiter.map(function (v) {
          return v.length;
        }))),
        trimChars: [Buffer.from(' ', options.encoding)[0], Buffer.from('\t', options.encoding)[0]],
        wasQuoting: false,
        wasRowDelimiter: false
      };
    } // Implementation of `Transform._transform`

  }, {
    key: "_transform",
    value: function _transform(buf, encoding, callback) {
      if (this.state.stop === true) {
        return;
      }

      var err = this.__parse(buf, false);

      if (err !== undefined) {
        this.state.stop = true;
      }

      callback(err);
    } // Implementation of `Transform._flush`

  }, {
    key: "_flush",
    value: function _flush(callback) {
      if (this.state.stop === true) {
        return;
      }

      var err = this.__parse(undefined, true);

      callback(err);
    } // Central parser implementation

  }, {
    key: "__parse",
    value: function __parse(nextBuf, end) {
      var _this$options = this.options,
          bom = _this$options.bom,
          comment = _this$options.comment,
          escape = _this$options.escape,
          from_line = _this$options.from_line,
          ltrim = _this$options.ltrim,
          max_record_size = _this$options.max_record_size,
          quote = _this$options.quote,
          raw = _this$options.raw,
          relax = _this$options.relax,
          rtrim = _this$options.rtrim,
          skip_empty_lines = _this$options.skip_empty_lines,
          to = _this$options.to,
          to_line = _this$options.to_line;
      var record_delimiter = this.options.record_delimiter;
      var _this$state = this.state,
          bomSkipped = _this$state.bomSkipped,
          previousBuf = _this$state.previousBuf,
          rawBuffer = _this$state.rawBuffer,
          escapeIsQuote = _this$state.escapeIsQuote;
      var buf;

      if (previousBuf === undefined) {
        if (nextBuf === undefined) {
          // Handle empty string
          this.push(null);
          return;
        } else {
          buf = nextBuf;
        }
      } else if (previousBuf !== undefined && nextBuf === undefined) {
        buf = previousBuf;
      } else {
        buf = Buffer.concat([previousBuf, nextBuf]);
      } // Handle UTF BOM


      if (bomSkipped === false) {
        if (bom === false) {
          this.state.bomSkipped = true;
        } else if (buf.length < 3) {
          // No enough data
          if (end === false) {
            // Wait for more data
            this.state.previousBuf = buf;
            return;
          }
        } else {
          for (var encoding in boms) {
            if (boms[encoding].compare(buf, 0, boms[encoding].length) === 0) {
              // Skip BOM
              var bomLength = boms[encoding].length;
              this.state.bufBytesStart += bomLength;
              buf = buf.slice(bomLength); // Renormalize original options with the new encoding

              this.__normalizeOptions(_objectSpread(_objectSpread({}, this.__originalOptions), {}, {
                encoding: encoding
              }));

              break;
            }
          }

          this.state.bomSkipped = true;
        }
      }

      var bufLen = buf.length;
      var pos;

      for (pos = 0; pos < bufLen; pos++) {
        // Ensure we get enough space to look ahead
        // There should be a way to move this out of the loop
        if (this.__needMoreData(pos, bufLen, end)) {
          break;
        }

        if (this.state.wasRowDelimiter === true) {
          this.info.lines++;
          this.state.wasRowDelimiter = false;
        }

        if (to_line !== -1 && this.info.lines > to_line) {
          this.state.stop = true;
          this.push(null);
          return;
        } // Auto discovery of record_delimiter, unix, mac and windows supported


        if (this.state.quoting === false && record_delimiter.length === 0) {
          var record_delimiterCount = this.__autoDiscoverRecordDelimiter(buf, pos);

          if (record_delimiterCount) {
            record_delimiter = this.options.record_delimiter;
          }
        }

        var chr = buf[pos];

        if (raw === true) {
          rawBuffer.append(chr);
        }

        if ((chr === cr || chr === nl) && this.state.wasRowDelimiter === false) {
          this.state.wasRowDelimiter = true;
        } // Previous char was a valid escape char
        // treat the current char as a regular char


        if (this.state.escaping === true) {
          this.state.escaping = false;
        } else {
          // Escape is only active inside quoted fields
          // We are quoting, the char is an escape chr and there is a chr to escape
          // if(escape !== null && this.state.quoting === true && chr === escape && pos + 1 < bufLen){
          if (escape !== null && this.state.quoting === true && this.__isEscape(buf, pos, chr) && pos + escape.length < bufLen) {
            if (escapeIsQuote) {
              if (this.__isQuote(buf, pos + escape.length)) {
                this.state.escaping = true;
                pos += escape.length - 1;
                continue;
              }
            } else {
              this.state.escaping = true;
              pos += escape.length - 1;
              continue;
            }
          } // Not currently escaping and chr is a quote
          // TODO: need to compare bytes instead of single char


          if (this.state.commenting === false && this.__isQuote(buf, pos)) {
            if (this.state.quoting === true) {
              var nextChr = buf[pos + quote.length];

              var isNextChrTrimable = rtrim && this.__isCharTrimable(nextChr);

              var isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos + quote.length, nextChr);

              var isNextChrDelimiter = this.__isDelimiter(buf, pos + quote.length, nextChr);

              var isNextChrRecordDelimiter = record_delimiter.length === 0 ? this.__autoDiscoverRecordDelimiter(buf, pos + quote.length) : this.__isRecordDelimiter(nextChr, buf, pos + quote.length); // Escape a quote
              // Treat next char as a regular character

              if (escape !== null && this.__isEscape(buf, pos, chr) && this.__isQuote(buf, pos + escape.length)) {
                pos += escape.length - 1;
              } else if (!nextChr || isNextChrDelimiter || isNextChrRecordDelimiter || isNextChrComment || isNextChrTrimable) {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                pos += quote.length - 1;
                continue;
              } else if (relax === false) {
                var err = this.__error(new CsvError('CSV_INVALID_CLOSING_QUOTE', ['Invalid Closing Quote:', "got \"".concat(String.fromCharCode(nextChr), "\""), "at line ".concat(this.info.lines), 'instead of delimiter, record delimiter, trimable character', '(if activated) or comment'], this.options, this.__infoField()));

                if (err !== undefined) return err;
              } else {
                this.state.quoting = false;
                this.state.wasQuoting = true;
                this.state.field.prepend(quote);
                pos += quote.length - 1;
              }
            } else {
              if (this.state.field.length !== 0) {
                // In relax mode, treat opening quote preceded by chrs as regular
                if (relax === false) {
                  var _err = this.__error(new CsvError('INVALID_OPENING_QUOTE', ['Invalid Opening Quote:', "a quote is found inside a field at line ".concat(this.info.lines)], this.options, this.__infoField(), {
                    field: this.state.field
                  }));

                  if (_err !== undefined) return _err;
                }
              } else {
                this.state.quoting = true;
                pos += quote.length - 1;
                continue;
              }
            }
          }

          if (this.state.quoting === false) {
            var recordDelimiterLength = this.__isRecordDelimiter(chr, buf, pos);

            if (recordDelimiterLength !== 0) {
              // Do not emit comments which take a full line
              var skipCommentLine = this.state.commenting && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0;

              if (skipCommentLine) {
                this.info.comment_lines++; // Skip full comment line
              } else {
                // Activate records emition if above from_line
                if (this.state.enabled === false && this.info.lines + (this.state.wasRowDelimiter === true ? 1 : 0) >= from_line) {
                  this.state.enabled = true;

                  this.__resetField();

                  this.__resetRecord();

                  pos += recordDelimiterLength - 1;
                  continue;
                } // Skip if line is empty and skip_empty_lines activated


                if (skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0) {
                  this.info.empty_lines++;
                  pos += recordDelimiterLength - 1;
                  continue;
                }

                this.info.bytes = this.state.bufBytesStart + pos;

                var errField = this.__onField();

                if (errField !== undefined) return errField;
                this.info.bytes = this.state.bufBytesStart + pos + recordDelimiterLength;

                var errRecord = this.__onRecord();

                if (errRecord !== undefined) return errRecord;

                if (to !== -1 && this.info.records >= to) {
                  this.state.stop = true;
                  this.push(null);
                  return;
                }
              }

              this.state.commenting = false;
              pos += recordDelimiterLength - 1;
              continue;
            }

            if (this.state.commenting) {
              continue;
            }

            var commentCount = comment === null ? 0 : this.__compareBytes(comment, buf, pos, chr);

            if (commentCount !== 0) {
              this.state.commenting = true;
              continue;
            }

            var delimiterLength = this.__isDelimiter(buf, pos, chr);

            if (delimiterLength !== 0) {
              this.info.bytes = this.state.bufBytesStart + pos;

              var _errField = this.__onField();

              if (_errField !== undefined) return _errField;
              pos += delimiterLength - 1;
              continue;
            }
          }
        }

        if (this.state.commenting === false) {
          if (max_record_size !== 0 && this.state.record_length + this.state.field.length > max_record_size) {
            var _err2 = this.__error(new CsvError('CSV_MAX_RECORD_SIZE', ['Max Record Size:', 'record exceed the maximum number of tolerated bytes', "of ".concat(max_record_size), "at line ".concat(this.info.lines)], this.options, this.__infoField()));

            if (_err2 !== undefined) return _err2;
          }
        }

        var lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(chr); // rtrim in non quoting is handle in __onField

        var rappend = rtrim === false || this.state.wasQuoting === false;

        if (lappend === true && rappend === true) {
          this.state.field.append(chr);
        } else if (rtrim === true && !this.__isCharTrimable(chr)) {
          var _err3 = this.__error(new CsvError('CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE', ['Invalid Closing Quote:', 'found non trimable byte after quote', "at line ".concat(this.info.lines)], this.options, this.__infoField()));

          if (_err3 !== undefined) return _err3;
        }
      }

      if (end === true) {
        // Ensure we are not ending in a quoting state
        if (this.state.quoting === true) {
          var _err4 = this.__error(new CsvError('CSV_QUOTE_NOT_CLOSED', ['Quote Not Closed:', "the parsing is finished with an opening quote at line ".concat(this.info.lines)], this.options, this.__infoField()));

          if (_err4 !== undefined) return _err4;
        } else {
          // Skip last line if it has no characters
          if (this.state.wasQuoting === true || this.state.record.length !== 0 || this.state.field.length !== 0) {
            this.info.bytes = this.state.bufBytesStart + pos;

            var _errField2 = this.__onField();

            if (_errField2 !== undefined) return _errField2;

            var _errRecord = this.__onRecord();

            if (_errRecord !== undefined) return _errRecord;
          } else if (this.state.wasRowDelimiter === true) {
            this.info.empty_lines++;
          } else if (this.state.commenting === true) {
            this.info.comment_lines++;
          }
        }
      } else {
        this.state.bufBytesStart += pos;
        this.state.previousBuf = buf.slice(pos);
      }

      if (this.state.wasRowDelimiter === true) {
        this.info.lines++;
        this.state.wasRowDelimiter = false;
      }
    }
  }, {
    key: "__onRecord",
    value: function __onRecord() {
      var _this$options2 = this.options,
          columns = _this$options2.columns,
          columns_duplicates_to_array = _this$options2.columns_duplicates_to_array,
          encoding = _this$options2.encoding,
          info = _this$options2.info,
          from = _this$options2.from,
          relax_column_count = _this$options2.relax_column_count,
          relax_column_count_less = _this$options2.relax_column_count_less,
          relax_column_count_more = _this$options2.relax_column_count_more,
          raw = _this$options2.raw,
          skip_lines_with_empty_values = _this$options2.skip_lines_with_empty_values;
      var _this$state2 = this.state,
          enabled = _this$state2.enabled,
          record = _this$state2.record;

      if (enabled === false) {
        return this.__resetRecord();
      } // Convert the first line into column names


      var recordLength = record.length;

      if (columns === true) {
        if (skip_lines_with_empty_values === true && isRecordEmpty(record)) {
          this.__resetRecord();

          return;
        }

        return this.__firstLineToColumns(record);
      }

      if (columns === false && this.info.records === 0) {
        this.state.expectedRecordLength = recordLength;
      }

      if (recordLength !== this.state.expectedRecordLength) {
        var err = columns === false ? // Todo: rename CSV_INCONSISTENT_RECORD_LENGTH to
        // CSV_RECORD_INCONSISTENT_FIELDS_LENGTH
        new CsvError('CSV_INCONSISTENT_RECORD_LENGTH', ['Invalid Record Length:', "expect ".concat(this.state.expectedRecordLength, ","), "got ".concat(recordLength, " on line ").concat(this.info.lines)], this.options, this.__infoField(), {
          record: record
        }) : // Todo: rename CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH to
        // CSV_RECORD_INCONSISTENT_COLUMNS
        new CsvError('CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH', ['Invalid Record Length:', "columns length is ".concat(columns.length, ","), // rename columns
        "got ".concat(recordLength, " on line ").concat(this.info.lines)], this.options, this.__infoField(), {
          record: record
        });

        if (relax_column_count === true || relax_column_count_less === true && recordLength < this.state.expectedRecordLength || relax_column_count_more === true && recordLength > this.state.expectedRecordLength) {
          this.info.invalid_field_length++;
          this.state.error = err; // Error is undefined with skip_lines_with_error
        } else {
          var finalErr = this.__error(err);

          if (finalErr) return finalErr;
        }
      }

      if (skip_lines_with_empty_values === true && isRecordEmpty(record)) {
        this.__resetRecord();

        return;
      }

      if (this.state.recordHasError === true) {
        this.__resetRecord();

        this.state.recordHasError = false;
        return;
      }

      this.info.records++;

      if (from === 1 || this.info.records >= from) {
        // With columns, records are object
        if (columns !== false) {
          var obj = {}; // Transform record array to an object

          for (var i = 0, l = record.length; i < l; i++) {
            if (columns[i] === undefined || columns[i].disabled) continue; // Turn duplicate columns into an array

            if (columns_duplicates_to_array === true && obj[columns[i].name] !== undefined) {
              if (Array.isArray(obj[columns[i].name])) {
                obj[columns[i].name] = obj[columns[i].name].concat(record[i]);
              } else {
                obj[columns[i].name] = [obj[columns[i].name], record[i]];
              }
            } else {
              obj[columns[i].name] = record[i];
            }
          }

          var objname = this.options.objname; // Without objname (default)

          if (objname === undefined) {
            if (raw === true || info === true) {
              var _err5 = this.__push(Object.assign({
                record: obj
              }, raw === true ? {
                raw: this.state.rawBuffer.toString(encoding)
              } : {}, info === true ? {
                info: this.__infoRecord()
              } : {}));

              if (_err5) {
                return _err5;
              }
            } else {
              var _err6 = this.__push(obj);

              if (_err6) {
                return _err6;
              }
            } // With objname (default)

          } else {
            if (raw === true || info === true) {
              var _err7 = this.__push(Object.assign({
                record: [obj[objname], obj]
              }, raw === true ? {
                raw: this.state.rawBuffer.toString(encoding)
              } : {}, info === true ? {
                info: this.__infoRecord()
              } : {}));

              if (_err7) {
                return _err7;
              }
            } else {
              var _err8 = this.__push([obj[objname], obj]);

              if (_err8) {
                return _err8;
              }
            }
          } // Without columns, records are array

        } else {
          if (raw === true || info === true) {
            var _err9 = this.__push(Object.assign({
              record: record
            }, raw === true ? {
              raw: this.state.rawBuffer.toString(encoding)
            } : {}, info === true ? {
              info: this.__infoRecord()
            } : {}));

            if (_err9) {
              return _err9;
            }
          } else {
            var _err10 = this.__push(record);

            if (_err10) {
              return _err10;
            }
          }
        }
      }

      this.__resetRecord();
    }
  }, {
    key: "__firstLineToColumns",
    value: function __firstLineToColumns(record) {
      var firstLineToHeaders = this.state.firstLineToHeaders;

      try {
        var headers = firstLineToHeaders === undefined ? record : firstLineToHeaders.call(null, record);

        if (!Array.isArray(headers)) {
          return this.__error(new CsvError('CSV_INVALID_COLUMN_MAPPING', ['Invalid Column Mapping:', 'expect an array from column function,', "got ".concat(JSON.stringify(headers))], this.options, this.__infoField(), {
            headers: headers
          }));
        }

        var normalizedHeaders = normalizeColumnsArray(headers);
        this.state.expectedRecordLength = normalizedHeaders.length;
        this.options.columns = normalizedHeaders;

        this.__resetRecord();

        return;
      } catch (err) {
        return err;
      }
    }
  }, {
    key: "__resetRecord",
    value: function __resetRecord() {
      if (this.options.raw === true) {
        this.state.rawBuffer.reset();
      }

      this.state.error = undefined;
      this.state.record = [];
      this.state.record_length = 0;
    }
  }, {
    key: "__onField",
    value: function __onField() {
      var _this$options3 = this.options,
          cast = _this$options3.cast,
          encoding = _this$options3.encoding,
          rtrim = _this$options3.rtrim,
          max_record_size = _this$options3.max_record_size;
      var _this$state3 = this.state,
          enabled = _this$state3.enabled,
          wasQuoting = _this$state3.wasQuoting; // Short circuit for the from_line options

      if (enabled === false) {
        return this.__resetField();
      }

      var field = this.state.field.toString(encoding);

      if (rtrim === true && wasQuoting === false) {
        field = field.trimRight();
      }

      if (cast === true) {
        var _this$__cast = this.__cast(field),
            _this$__cast2 = _slicedToArray(_this$__cast, 2),
            err = _this$__cast2[0],
            f = _this$__cast2[1];

        if (err !== undefined) return err;
        field = f;
      }

      this.state.record.push(field); // Increment record length if record size must not exceed a limit

      if (max_record_size !== 0 && typeof field === 'string') {
        this.state.record_length += field.length;
      }

      this.__resetField();
    }
  }, {
    key: "__resetField",
    value: function __resetField() {
      this.state.field.reset();
      this.state.wasQuoting = false;
    }
  }, {
    key: "__push",
    value: function __push(record) {
      var on_record = this.options.on_record;

      if (on_record !== undefined) {
        var info = this.__infoRecord();

        try {
          record = on_record.call(null, record, info);
        } catch (err) {
          return err;
        }

        if (record === undefined || record === null) {
          return;
        }
      }

      this.push(record);
    } // Return a tuple with the error and the casted value

  }, {
    key: "__cast",
    value: function __cast(field) {
      var _this$options4 = this.options,
          columns = _this$options4.columns,
          relax_column_count = _this$options4.relax_column_count;
      var isColumns = Array.isArray(columns); // Dont loose time calling cast
      // because the final record is an object
      // and this field can't be associated to a key present in columns

      if (isColumns === true && relax_column_count && this.options.columns.length <= this.state.record.length) {
        return [undefined, undefined];
      }

      if (this.state.castField !== null) {
        try {
          var info = this.__infoField();

          return [undefined, this.state.castField.call(null, field, info)];
        } catch (err) {
          return [err];
        }
      }

      if (this.__isFloat(field)) {
        return [undefined, parseFloat(field)];
      } else if (this.options.cast_date !== false) {
        var _info = this.__infoField();

        return [undefined, this.options.cast_date.call(null, field, _info)];
      }

      return [undefined, field];
    } // Helper to test if a character is a space or a line delimiter

  }, {
    key: "__isCharTrimable",
    value: function __isCharTrimable(chr) {
      return chr === space || chr === tab || chr === cr || chr === nl || chr === np;
    } // Keep it in case we implement the `cast_int` option
    // __isInt(value){
    //   // return Number.isInteger(parseInt(value))
    //   // return !isNaN( parseInt( obj ) );
    //   return /^(\-|\+)?[1-9][0-9]*$/.test(value)
    // }

  }, {
    key: "__isFloat",
    value: function __isFloat(value) {
      return value - parseFloat(value) + 1 >= 0; // Borrowed from jquery
    }
  }, {
    key: "__compareBytes",
    value: function __compareBytes(sourceBuf, targetBuf, targetPos, firstByte) {
      if (sourceBuf[0] !== firstByte) return 0;
      var sourceLength = sourceBuf.length;

      for (var i = 1; i < sourceLength; i++) {
        if (sourceBuf[i] !== targetBuf[targetPos + i]) return 0;
      }

      return sourceLength;
    }
  }, {
    key: "__needMoreData",
    value: function __needMoreData(i, bufLen, end) {
      if (end) return false;
      var quote = this.options.quote;
      var _this$state4 = this.state,
          quoting = _this$state4.quoting,
          needMoreDataSize = _this$state4.needMoreDataSize,
          recordDelimiterMaxLength = _this$state4.recordDelimiterMaxLength;
      var numOfCharLeft = bufLen - i - 1;
      var requiredLength = Math.max(needMoreDataSize, // Skip if the remaining buffer smaller than record delimiter
      recordDelimiterMaxLength, // Skip if the remaining buffer can be record delimiter following the closing quote
      // 1 is for quote.length
      quoting ? quote.length + recordDelimiterMaxLength : 0);
      return numOfCharLeft < requiredLength;
    }
  }, {
    key: "__isDelimiter",
    value: function __isDelimiter(buf, pos, chr) {
      var _this$options5 = this.options,
          delimiter = _this$options5.delimiter,
          ignore_last_delimiters = _this$options5.ignore_last_delimiters;

      if (ignore_last_delimiters === true && this.state.record.length === this.options.columns.length - 1) {
        return 0;
      } else if (ignore_last_delimiters !== false && typeof ignore_last_delimiters === 'number' && this.state.record.length === ignore_last_delimiters - 1) {
        return 0;
      }

      loop1: for (var i = 0; i < delimiter.length; i++) {
        var del = delimiter[i];

        if (del[0] === chr) {
          for (var j = 1; j < del.length; j++) {
            if (del[j] !== buf[pos + j]) continue loop1;
          }

          return del.length;
        }
      }

      return 0;
    }
  }, {
    key: "__isRecordDelimiter",
    value: function __isRecordDelimiter(chr, buf, pos) {
      var record_delimiter = this.options.record_delimiter;
      var recordDelimiterLength = record_delimiter.length;

      loop1: for (var i = 0; i < recordDelimiterLength; i++) {
        var rd = record_delimiter[i];
        var rdLength = rd.length;

        if (rd[0] !== chr) {
          continue;
        }

        for (var j = 1; j < rdLength; j++) {
          if (rd[j] !== buf[pos + j]) {
            continue loop1;
          }
        }

        return rd.length;
      }

      return 0;
    }
  }, {
    key: "__isEscape",
    value: function __isEscape(buf, pos, chr) {
      var escape = this.options.escape;
      if (escape === null) return false;
      var l = escape.length;

      if (escape[0] === chr) {
        for (var i = 0; i < l; i++) {
          if (escape[i] !== buf[pos + i]) {
            return false;
          }
        }

        return true;
      }

      return false;
    }
  }, {
    key: "__isQuote",
    value: function __isQuote(buf, pos) {
      var quote = this.options.quote;
      if (quote === null) return false;
      var l = quote.length;

      for (var i = 0; i < l; i++) {
        if (quote[i] !== buf[pos + i]) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: "__autoDiscoverRecordDelimiter",
    value: function __autoDiscoverRecordDelimiter(buf, pos) {
      var encoding = this.options.encoding;
      var chr = buf[pos];

      if (chr === cr) {
        if (buf[pos + 1] === nl) {
          this.options.record_delimiter.push(Buffer.from('\r\n', encoding));
          this.state.recordDelimiterMaxLength = 2;
          return 2;
        } else {
          this.options.record_delimiter.push(Buffer.from('\r', encoding));
          this.state.recordDelimiterMaxLength = 1;
          return 1;
        }
      } else if (chr === nl) {
        this.options.record_delimiter.push(Buffer.from('\n', encoding));
        this.state.recordDelimiterMaxLength = 1;
        return 1;
      }

      return 0;
    }
  }, {
    key: "__error",
    value: function __error(msg) {
      var skip_lines_with_error = this.options.skip_lines_with_error;
      var err = typeof msg === 'string' ? new Error(msg) : msg;

      if (skip_lines_with_error) {
        this.state.recordHasError = true;
        this.emit('skip', err);
        return undefined;
      } else {
        return err;
      }
    }
  }, {
    key: "__infoDataSet",
    value: function __infoDataSet() {
      return _objectSpread(_objectSpread({}, this.info), {}, {
        columns: this.options.columns
      });
    }
  }, {
    key: "__infoRecord",
    value: function __infoRecord() {
      var columns = this.options.columns;
      return _objectSpread(_objectSpread({}, this.__infoDataSet()), {}, {
        error: this.state.error,
        header: columns === true,
        index: this.state.record.length
      });
    }
  }, {
    key: "__infoField",
    value: function __infoField() {
      var columns = this.options.columns;
      var isColumns = Array.isArray(columns);
      return _objectSpread(_objectSpread({}, this.__infoRecord()), {}, {
        column: isColumns === true ? columns.length > this.state.record.length ? columns[this.state.record.length].name : null : this.state.record.length,
        quoting: this.state.wasQuoting
      });
    }
  }]);

  return Parser;
}(Transform);

var parse = function parse() {
  var data, options, callback;

  for (var i in arguments) {
    var argument = arguments[i];

    var type = _typeof(argument);

    if (data === undefined && (typeof argument === 'string' || Buffer.isBuffer(argument))) {
      data = argument;
    } else if (options === undefined && isObject(argument)) {
      options = argument;
    } else if (callback === undefined && type === 'function') {
      callback = argument;
    } else {
      throw new CsvError('CSV_INVALID_ARGUMENT', ['Invalid argument:', "got ".concat(JSON.stringify(argument), " at index ").concat(i)], options || {});
    }
  }

  var parser = new Parser(options);

  if (callback) {
    var records = options === undefined || options.objname === undefined ? [] : {};
    parser.on('readable', function () {
      var record;

      while ((record = this.read()) !== null) {
        if (options === undefined || options.objname === undefined) {
          records.push(record);
        } else {
          records[record[0]] = record[1];
        }
      }
    });
    parser.on('error', function (err) {
      callback(err, undefined, parser.__infoDataSet());
    });
    parser.on('end', function () {
      callback(undefined, records, parser.__infoDataSet());
    });
  }

  if (data !== undefined) {
    // Give a chance for events to be registered later
    if (typeof setImmediate === 'function') {
      setImmediate(function () {
        parser.write(data);
        parser.end();
      });
    } else {
      parser.write(data);
      parser.end();
    }
  }

  return parser;
};

var CsvError = /*#__PURE__*/function (_Error) {
  _inherits(CsvError, _Error);

  var _super2 = _createSuper(CsvError);

  function CsvError(code, message, options) {
    var _this2;

    _classCallCheck(this, CsvError);

    if (Array.isArray(message)) message = message.join(' ');
    _this2 = _super2.call(this, message);

    if (Error.captureStackTrace !== undefined) {
      Error.captureStackTrace(_assertThisInitialized(_this2), CsvError);
    }

    _this2.code = code;

    for (var _len = arguments.length, contexts = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      contexts[_key - 3] = arguments[_key];
    }

    for (var _i2 = 0, _contexts = contexts; _i2 < _contexts.length; _i2++) {
      var context = _contexts[_i2];

      for (var key in context) {
        var value = context[key];
        _this2[key] = Buffer.isBuffer(value) ? value.toString(options.encoding) : value == null ? value : JSON.parse(JSON.stringify(value));
      }
    }

    return _this2;
  }

  return CsvError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

parse.Parser = Parser;
parse.CsvError = CsvError;
module.exports = parse;

var underscore = function underscore(str) {
  return str.replace(/([A-Z])/g, function (_, match) {
    return '_' + match.toLowerCase();
  });
};

var isObject = function isObject(obj) {
  return _typeof(obj) === 'object' && obj !== null && !Array.isArray(obj);
};

var isRecordEmpty = function isRecordEmpty(record) {
  return record.every(function (field) {
    return field == null || field.toString && field.toString().trim() === '';
  });
};

var normalizeColumnsArray = function normalizeColumnsArray(columns) {
  var normalizedColumns = [];

  for (var i = 0, l = columns.length; i < l; i++) {
    var column = columns[i];

    if (column === undefined || column === null || column === false) {
      normalizedColumns[i] = {
        disabled: true
      };
    } else if (typeof column === 'string') {
      normalizedColumns[i] = {
        name: column
      };
    } else if (isObject(column)) {
      if (typeof column.name !== 'string') {
        throw new CsvError('CSV_OPTION_COLUMNS_MISSING_NAME', ['Option columns missing name:', "property \"name\" is required at position ".concat(i), 'when column is an object literal']);
      }

      normalizedColumns[i] = column;
    } else {
      throw new CsvError('CSV_INVALID_COLUMN_DEFINITION', ['Invalid column definition:', 'expect a string or a literal object,', "got ".concat(JSON.stringify(column), " at position ").concat(i)]);
    }
  }

  return normalizedColumns;
};