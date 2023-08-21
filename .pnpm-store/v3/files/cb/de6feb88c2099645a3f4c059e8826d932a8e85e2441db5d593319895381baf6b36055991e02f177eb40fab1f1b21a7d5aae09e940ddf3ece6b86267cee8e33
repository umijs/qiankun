"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _utils() {
  const data = require("@umijs/utils");
  _utils = function _utils() {
    return data;
  };
  return data;
}
var _flat = _interopRequireDefault(require("./flat"));
var _frontMatter = _interopRequireDefault(require("./frontMatter"));
var _hide = _interopRequireDefault(require("./hide"));
var _locale = _interopRequireDefault(require("./locale"));
var _title = _interopRequireDefault(require("./title"));
var _nav = _interopRequireDefault(require("./nav"));
var _group = _interopRequireDefault(require("./group"));
var _fallback = _interopRequireDefault(require("./fallback"));
var _redirect = _interopRequireDefault(require("./redirect"));
var _relative = _interopRequireDefault(require("./relative"));
var _integrate = _interopRequireDefault(require("./integrate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class RouteDecorator {
  constructor(options, umi) {
    this.processors = [];
    this.options = void 0;
    this.umi = void 0;
    this.debug = (0, _utils().createDebug)('dumi:routes:decorator');
    /**
     * shared storage for all processors
     */
    this.data = {};
    this.options = options;
    this.umi = umi;
  }
  use(processor) {
    this.processors.push(processor);
    return this;
  }
  process(routes) {
    return this.processors.reduce((result, processor) => {
      const r = processor.call({
        options: this.options,
        umi: this.umi,
        data: this.data
      }, result);
      this.debug(processor.name);
      return r;
    }, routes);
  }
}
/**
 * decorator standard umi routes for dumi
 */
var _default = (routes, opts, umi) => {
  const decorator = new RouteDecorator(opts, umi);
  decorator.use(_flat.default).use(_frontMatter.default).use(_hide.default).use(_locale.default).use(_nav.default).use(_group.default).use(_title.default).use(_fallback.default).use(_integrate.default).use(_redirect.default).use(_relative.default);
  return decorator.process(routes);
};
exports.default = _default;