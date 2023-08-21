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
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
    return data;
  };
  return data;
}
function _sitemap() {
  const data = require("sitemap");
  _sitemap = function _sitemap() {
    return data;
  };
  return data;
}
var _context = _interopRequireDefault(require("../../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/**
 * plugin for generate sitemap.xml for doc site
 */
var _default = api => {
  api.describe({
    key: 'sitemap',
    config: {
      schema(joi) {
        return joi.object({
          hostname: joi.string().required(),
          excludes: joi.array().items(joi.string())
        });
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });
  if (api.env === 'production' && api.userConfig.sitemap && !_context.default.opts.isIntegrate) {
    api.onBuildComplete( /*#__PURE__*/_asyncToGenerator(function* () {
      const smis = new (_sitemap().SitemapStream)({
        hostname: api.config.sitemap.hostname,
        xmlns: {
          video: false,
          image: false,
          news: false,
          xhtml: false
        }
      });
      const _yield$api$applyPlugi = yield api.applyPlugins({
          key: 'dumi.getRootRoute',
          type: api.ApplyPluginsType.modify,
          initialValue: yield api.getRoutes()
        }),
        routes = _yield$api$applyPlugi.routes;
      const excludes = ['/404'].concat(api.config.sitemap.excludes);
      const writeStream = _fs().default.createWriteStream(_path().default.join(api.paths.absOutputPath, 'sitemap.xml'));
      smis.pipe(writeStream);
      routes.forEach(route => {
        if (
        // ignore specific paths
        !excludes.includes(route.path) &&
        // ignore dynamic route, such as /~demos/:uuid
        !route.path.includes(':')) {
          smis.write({
            url: route.path
          });
        }
      });
      smis.end();
      yield new Promise(resolve => writeStream.on('close', resolve));
      api.logger.info('sitemap.xml generated successfully!');
    }));
  }
};
exports.default = _default;