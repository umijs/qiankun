"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _reactRouterConfig() {
  const data = require("react-router-config");

  _reactRouterConfig = function _reactRouterConfig() {
    return data;
  };

  return data;
}

function _stream() {
  const data = require("stream");

  _stream = function _stream() {
    return data;
  };

  return data;
}

var _htmlUtils = require("../htmlUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const ASSET_EXTNAMES = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.json'];

var _default = ({
  api,
  sharedMap
}) => {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (req, res, next) {
      function sendHtml() {
        return _sendHtml.apply(this, arguments);
      }

      function _sendHtml() {
        _sendHtml = _asyncToGenerator(function* () {
          const html = (0, _htmlUtils.getHtmlGenerator)({
            api
          });
          let route = {
            path: req.path
          };

          if (api.config.exportStatic) {
            const routes = yield api.getRoutes();
            const matchedRoutes = (0, _reactRouterConfig().matchRoutes)(routes, req.path);

            if (matchedRoutes.length) {
              route = matchedRoutes[matchedRoutes.length - 1].route;
            }
          }

          const defaultContent = yield html.getContent({
            route,
            chunks: sharedMap.get('chunks')
          });
          const content = yield api.applyPlugins({
            key: 'modifyDevHTMLContent',
            type: api.ApplyPluginsType.modify,
            initialValue: defaultContent,
            args: {
              req
            }
          });
          res.setHeader('Content-Type', 'text/html'); // support stream content

          if (content instanceof _stream().Stream) {
            content.pipe(res);
            content.on('end', function () {
              res.end();
            });
          } else {
            res.send(content);
          }
        });
        return _sendHtml.apply(this, arguments);
      }

      if (req.path === '/favicon.ico') {
        res.sendFile((0, _path().join)(__dirname, 'umi.png'));
      } else if (ASSET_EXTNAMES.includes((0, _path().extname)(req.path))) {
        next();
      } else {
        yield sendHtml();
      }
    });

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports.default = _default;