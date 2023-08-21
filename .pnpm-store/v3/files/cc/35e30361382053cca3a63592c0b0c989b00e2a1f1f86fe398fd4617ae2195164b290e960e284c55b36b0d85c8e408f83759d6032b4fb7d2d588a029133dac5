"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
// Firefox has low performance of map.
var CacheMap = /*#__PURE__*/function () {
  function CacheMap() {
    (0, _classCallCheck2.default)(this, CacheMap);
    this.maps = void 0;
    // Used for cache key
    // `useMemo` no need to update if `id` not change
    this.id = 0;
    this.maps = Object.create(null);
  }
  (0, _createClass2.default)(CacheMap, [{
    key: "set",
    value: function set(key, value) {
      this.maps[key] = value;
      this.id += 1;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.maps[key];
    }
  }]);
  return CacheMap;
}();
var _default = CacheMap;
exports.default = _default;