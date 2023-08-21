"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _getLocaleFromRoutes = _interopRequireDefault(require("../../routes/getLocaleFromRoutes"));
var _getMenuFromRoutes = _interopRequireDefault(require("../../routes/getMenuFromRoutes"));
var _getNavFromRoutes = _interopRequireDefault(require("../../routes/getNavFromRoutes"));
var _getRepoUrl = _interopRequireDefault(require("../../utils/getRepoUrl"));
var _context = _interopRequireDefault(require("../../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/**
 * plugin for generate dumi config into .umi temp directory
 */
var _default = api => {
  // write config.json when generating temp files
  api.onGenerateFiles( /*#__PURE__*/_asyncToGenerator(function* () {
    var _api$pkg$repository, _api$pkg$repository2, _api$pkg$repository3, _api$pkg$repository4;
    const _yield$api$applyPlugi = yield api.applyPlugins({
        key: 'dumi.getRootRoute',
        type: api.ApplyPluginsType.modify,
        initialValue: yield api.getRoutes()
      }),
      routes = _yield$api$applyPlugi.routes;
    const config = {
      menus: (0, _getMenuFromRoutes.default)(routes, _context.default.opts, api.paths),
      locales: (0, _getLocaleFromRoutes.default)(routes, _context.default.opts),
      navs: (0, _getNavFromRoutes.default)(routes, _context.default.opts, _context.default.opts.navs),
      title: _context.default.opts.title,
      logo: _context.default.opts.logo,
      description: _context.default.opts.description,
      mode: _context.default.opts.mode,
      repository: {
        url: (0, _getRepoUrl.default)(((_api$pkg$repository = api.pkg.repository) === null || _api$pkg$repository === void 0 ? void 0 : _api$pkg$repository.url) || api.pkg.repository, (_api$pkg$repository2 = api.pkg.repository) === null || _api$pkg$repository2 === void 0 ? void 0 : _api$pkg$repository2.platform),
        branch: ((_api$pkg$repository3 = api.pkg.repository) === null || _api$pkg$repository3 === void 0 ? void 0 : _api$pkg$repository3.branch) || 'master',
        platform: (_api$pkg$repository4 = api.pkg.repository) === null || _api$pkg$repository4 === void 0 ? void 0 : _api$pkg$repository4.platform
      },
      algolia: _context.default.opts.algolia,
      theme: _context.default.opts.theme,
      exportStatic: api.config.exportStatic
    };
    api.writeTmpFile({
      path: 'dumi/config.json',
      content: JSON.stringify(config, null, 2)
    });
  }));
};
exports.default = _default;