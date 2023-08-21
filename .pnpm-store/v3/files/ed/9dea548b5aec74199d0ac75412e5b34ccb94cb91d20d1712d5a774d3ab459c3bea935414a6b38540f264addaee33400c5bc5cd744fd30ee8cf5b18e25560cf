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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function process(routes, parent) {
  const result = [];
  routes.forEach(route => {
    const _route$routes = route.routes,
          childs = _route$routes === void 0 ? [] : _route$routes,
          current = _objectWithoutProperties(route, ["routes"]);

    if (childs.length) {
      // discard parent route if there has child routes
      result.push(...process(childs, current));
    } else {
      // push parent route directly if there has no child route
      if (typeof (parent === null || parent === void 0 ? void 0 : parent.component) === 'string') {
        // use parent component as Umi router's wrappers
        current.wrappers = [parent.component, ...(current.wrappers || [])];
      }

      result.push(current);
    }
  });
  return result;
}
/**
 * flat child routes decorator
 */


var _default = routes => process(routes);

exports.default = _default;