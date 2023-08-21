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
const RIDDLE_API_ENDPOINT = 'https://riddle.alibaba-inc.com/riddles/define';
let isInternalNetwork;
const useInternalNet = () => {
  const _useState = (0, _react().useState)(Boolean(isInternalNetwork)),
    _useState2 = _slicedToArray(_useState, 2),
    isInternal = _useState2[0],
    setIsInternal = _useState2[1];
  (0, _react().useEffect)(() => {
    if (isInternalNetwork === undefined) {
      // detect network via img request
      const img = document.createElement('img');
      // interrupt image pending after 200ms
      setTimeout(() => {
        img.src = '';
        img.remove();
      }, 200);
      img.onload = () => {
        isInternalNetwork = true;
        setIsInternal(true);
        img.remove();
      };
      img.src = 'https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/rmsportal/RKuAiriJqrUhyqW.png';
    }
  }, []);
  return isInternal;
};
/**
 * get js code for Riddle
 * @param opts  previewer props
 */
function getRiddleAppCode(opts) {
  let result = opts.sources._.tsx || opts.sources._.jsx;
  // convert export default to ReactDOM.render for riddle
  result = result.replace(/^/, `import ReactDOM from 'react-dom';\n`).replace('export default', 'const DumiDemo =').concat('\nReactDOM.render(<DumiDemo />, mountNode);');
  return result;
}
var _default = opts => {
  const _useState3 = (0, _react().useState)(),
    _useState4 = _slicedToArray(_useState3, 2),
    handler = _useState4[0],
    setHandler = _useState4[1];
  const isInternal = useInternalNet();
  (0, _react().useEffect)(() => {
    if (opts && isInternal &&
    // TODO: riddle is not support multiple files for currently
    Object.keys(opts.sources).length === 1) {
      var _opts$dependencies$re;
      const form = document.createElement('form');
      const input = document.createElement('input');
      form.method = 'POST';
      form.target = '_blank';
      form.style.display = 'none';
      form.action = RIDDLE_API_ENDPOINT;
      form.appendChild(input);
      form.setAttribute('data-demo', opts.title || '');
      input.name = 'data';
      // create riddle data
      input.value = JSON.stringify({
        title: opts.titlle,
        js: getRiddleAppCode(opts),
        css: Object.entries(opts.dependencies).filter(([, dep]) => dep.css).map(([name, {
          version,
          css
        }]) =>
        // generate to @import '~pkg@version/path/to/css' format
        `@import '~${css.replace(new RegExp(`^(${name})`), `$1@${version}`)}';`).concat(opts.background ? `body {\n  background: ${opts.background};\n}` : '').join('\n'),
        json: JSON.stringify({
          description: opts.description,
          dependencies: Object.entries(opts.dependencies).reduce((r, [name, {
            version
          }]) => _objectSpread(_objectSpread({}, r), {}, {
            [name]: version
          }), {
            'react-dom': ((_opts$dependencies$re = opts.dependencies.react) === null || _opts$dependencies$re === void 0 ? void 0 : _opts$dependencies$re.version) || 'latest'
          })
        }, null, 2)
      });
      document.body.appendChild(form);
      setHandler(() => () => form.submit());
      return () => form.remove();
    }
  }, [opts, isInternal]);
  return handler;
};
exports.default = _default;