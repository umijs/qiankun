"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
    return data;
  };
  return data;
}
var _context = require("../../context");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const UMI_LIKE_PKGS = ['umi', '@alipay/bigfish'];
/**
 * dumi prepare plugin
 */
var _default = api => {
  var _api$args;
  const deps = Object.assign({}, api.pkg.dependencies, api.pkg.devDependencies);
  // enable ingetrate mode if dumi was registered as a umi preset on a umi like project
  const isIntegrateUmi = UMI_LIKE_PKGS.some(pkg => deps[pkg]) && deps['@umijs/preset-dumi'] &&
  // also can force disable integrate mode by umi build --dumi
  ((_api$args = api.args) === null || _api$args === void 0 ? void 0 : _api$args.dumi) === undefined;
  // init context & share umi api with other source module
  (0, _context.init)(api, {
    isIntegrate: isIntegrateUmi
  });
  // use modifyConfig api for update context
  // because both of the umi service init & user config changed will trigger this plugin key
  api.modifyConfig(memo => {
    // share config with other source module via context
    (0, _context.setOptions)('title', memo.title || api.pkg.name || 'dumi');
    // pass empty routes if pages path does not exist and no routes config
    // to avoid umi throw src directory not exists error
    if (!memo.routes && !_fs().default.existsSync(api.paths.absPagesPath)) {
      memo.routes = [];
    }
    return memo;
  });
  // re-enable @ & @@ umi default alias for integrated mode
  api.modifyDefaultConfig(memo => {
    var _api$args2;
    if (isIntegrateUmi || ((_api$args2 = api.args) === null || _api$args2 === void 0 ? void 0 : _api$args2.dumi)) {
      memo.alias['@'] = api.paths.absSrcPath;
      memo.alias['@@'] = api.paths.absTmpPath;
    }
    // enable dist hash by default
    memo.hash = true;
    return memo;
  });
};
exports.default = _default;