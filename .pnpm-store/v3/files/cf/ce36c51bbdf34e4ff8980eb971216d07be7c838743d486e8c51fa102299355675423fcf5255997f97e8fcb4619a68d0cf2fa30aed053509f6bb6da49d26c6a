"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _core() {
  const data = require("@umijs/core");

  _core = function _core() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(api) {
  api.describe({
    key: 'routes',
    config: {
      schema(joi) {
        return joi.array().items(joi.object({
          path: joi.string().description('Any valid URL path'),
          component: joi.alternatives(joi.string(), joi.function()).description('A React component to render only when the location matches.'),
          wrappers: joi.array().items(joi.string()),
          redirect: joi.string().description('navigate to a new location'),
          exact: joi.boolean().description('When true, the active class/style will only be applied if the location is matched exactly.'),
          routes: joi.array().items(joi.link('...'))
        }).unknown());
      },

      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });
  api.registerMethod({
    name: 'getRoutes',

    fn() {
      return _asyncToGenerator(function* () {
        const route = new (_core().Route)({
          onPatchRoutesBefore(args) {
            return _asyncToGenerator(function* () {
              yield api.applyPlugins({
                key: 'onPatchRoutesBefore',
                type: api.ApplyPluginsType.event,
                args
              });
            })();
          },

          onPatchRoutes(args) {
            return _asyncToGenerator(function* () {
              yield api.applyPlugins({
                key: 'onPatchRoutes',
                type: api.ApplyPluginsType.event,
                args
              });
            })();
          },

          onPatchRouteBefore(args) {
            return _asyncToGenerator(function* () {
              yield api.applyPlugins({
                key: 'onPatchRouteBefore',
                type: api.ApplyPluginsType.event,
                args
              });
            })();
          },

          onPatchRoute(args) {
            return _asyncToGenerator(function* () {
              yield api.applyPlugins({
                key: 'onPatchRoute',
                type: api.ApplyPluginsType.event,
                args
              });
            })();
          }

        });
        return yield api.applyPlugins({
          key: 'modifyRoutes',
          type: api.ApplyPluginsType.modify,
          initialValue: yield route.getRoutes({
            config: api.config,
            root: api.paths.absPagesPath
          })
        });
      })();
    }

  });
}