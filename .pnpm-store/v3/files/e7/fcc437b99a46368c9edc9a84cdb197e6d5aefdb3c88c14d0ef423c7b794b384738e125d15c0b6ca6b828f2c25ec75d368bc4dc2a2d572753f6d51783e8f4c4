"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchRoutes = patchRoutes;
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function patchRoutes(routes, config) {
  let notFoundIndex = null;
  routes.forEach((route, index) => {
    if (route.path === '/404') {
      notFoundIndex = index;
    }

    if (route.routes) {
      patchRoutes(route.routes, config);
    }
  });

  if (notFoundIndex !== null && !config.exportStatic) {
    const notFoundRoute = routes.slice(notFoundIndex, notFoundIndex + 1)[0];

    if (notFoundRoute.component) {
      routes.push({
        component: notFoundRoute.component
      });
    } else if (notFoundRoute.redirect) {
      routes.push({
        redirect: notFoundRoute.redirect
      });
    } else {
      throw new Error('Invalid route config for /404');
    }
  }

  return routes;
}

var _default = api => {
  api.describe({
    key: '404',
    config: {
      schema(joi) {
        return joi.boolean();
      }

    }
  });
  api.modifyRoutes(routes => {
    return patchRoutes(routes, api.config);
  });
};

exports.default = _default;