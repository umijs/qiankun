"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
    return data;
  };
  return data;
}
var _context = require("../../context");
var _getHostPkgAlias = _interopRequireDefault(require("../../utils/getHostPkgAlias"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = api => {
  const hostPkgAlias = (0, _getHostPkgAlias.default)(api.paths);
  api.describe({
    key: 'resolve',
    config: {
      default: {},
      schema(joi) {
        return joi.object();
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });
  // share config with other source module via context
  api.modifyConfig(memo => {
    (0, _context.setOptions)('resolve', {
      previewLangs: memo.resolve.previewLangs || ['jsx', 'tsx'],
      // default to include src, lerna pkg's src & docs folder
      includes: memo.resolve.includes || hostPkgAlias.map(([_, pkgPath]) => _path().default.relative(api.paths.cwd, _path().default.join(pkgPath, 'src'))).concat(['docs']),
      examples: memo.resolve.examples || ['examples'],
      passivePreview: memo.resolve.passivePreview || false,
      excludes: memo.resolve.excludes || []
    });
    return memo;
  });
};
exports.default = _default;