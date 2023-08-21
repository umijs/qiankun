"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _react() {
  const data = require("react");
  _react = function _react() {
    return data;
  };
  return data;
}
var _ = require("..");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * hooks for get search result by keywords (builtin search feature)
 * @param keywords  search keywords
 */
const useBuiltinSearch = keywords => {
  const _useContext = (0, _react().useContext)(_.context),
    locale = _useContext.locale,
    routes = _useContext.routes,
    locales = _useContext.config.locales;
  const _useState = (0, _react().useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    metas = _useState2[0],
    setMetas = _useState2[1];
  const _useState3 = (0, _react().useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    items = _useState4[0],
    setItems = _useState4[1];
  (0, _react().useEffect)(() => {
    setMetas(routes.filter(({
      title,
      meta
    }) => {
      const isValidLocaleRoute = (meta === null || meta === void 0 ? void 0 : meta.locale) === locale;
      const isValidDefaultLocaleRoute =
      // missing locale and there has no locale or global locale equal default locale
      !(meta === null || meta === void 0 ? void 0 : meta.locale) && (!locales.length || locale === locales[0].name);
      return title && (isValidDefaultLocaleRoute || isValidLocaleRoute);
    }).reduce((result, route) => {
      var _route$meta, _route$meta2, _route$meta3;
      const routeMetaItem = {
        title: ((_route$meta = route.meta) === null || _route$meta === void 0 ? void 0 : _route$meta.title) || route.title,
        path: route.path
      };
      if ((_route$meta2 = route.meta) === null || _route$meta2 === void 0 ? void 0 : _route$meta2.group) {
        routeMetaItem.parent = route.meta.group;
      }
      result.push(routeMetaItem);
      result.push(...(((_route$meta3 = route.meta) === null || _route$meta3 === void 0 ? void 0 : _route$meta3.slugs) || []).filter(({
        value
      }) => {
        var _route$meta4;
        return value !== (((_route$meta4 = route.meta) === null || _route$meta4 === void 0 ? void 0 : _route$meta4.title) || route.title);
      }).map(slug => ({
        title: slug.value,
        path: `${route.path}#${slug.heading}`,
        parent: routeMetaItem
      })));
      return result;
    }, []));
  }, [routes.length, locale]);
  (0, _react().useEffect)(() => {
    const val = keywords === null || keywords === void 0 ? void 0 : keywords.trim().toUpperCase();
    if (val) {
      const result = [];
      for (let i = 0; i < metas.length; i += 1) {
        if (metas[i].title.toUpperCase().indexOf(val) > -1) {
          result.push(metas[i]);
        }
      }
      setItems(result);
    } else {
      setItems([]);
    }
  }, [keywords, metas.length]);
  return items;
};
/**
 * hooks for bind Algolia search feature
 */
const useAlgoliaSearch = () => {
  const _useContext2 = (0, _react().useContext)(_.context),
    algolia = _useContext2.config.algolia;
  const binder = (0, _react().useCallback)(selector => {
    window.docsearch(_objectSpread({
      inputSelector: selector
    }, algolia));
  }, [algolia]);
  return binder;
};
/**
 * use to bind algolia or return search result by keywords
 */
var _default = keywords => {
  const _useContext3 = (0, _react().useContext)(_.context),
    config = _useContext3.config;
  const builtin = useBuiltinSearch(keywords);
  const algolia = useAlgoliaSearch();
  return config.algolia ? algolia : builtin;
};
exports.default = _default;