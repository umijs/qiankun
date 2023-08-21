"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function parser() {
  const data = _interopRequireWildcard(require("react-docgen-typescript-dumi-tmp"));
  parser = function parser() {
    return data;
  };
  return data;
}
function _buildFilter() {
  const data = require("react-docgen-typescript-dumi-tmp/lib/buildFilter");
  _buildFilter = function _buildFilter() {
    return data;
  };
  return data;
}
var _cache = _interopRequireDefault(require("../utils/cache"));
var _context = _interopRequireDefault(require("../context"));
const _excluded = ["componentName"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const cacher = new _cache.default();
// ref: https://github.com/styleguidist/react-docgen-typescript/blob/048980a/src/parser.ts#L1110
const DEFAULT_EXPORTS = ['default', '__function', 'Stateless', 'StyledComponentClass', 'StyledComponent', 'FunctionComponent', 'StatelessComponent', 'ForwardRefExoticComponent'];
/**
 * implement skipNodeModules filter option
 * @param prop  api prop item, from parser
 * @param opts  filter options
 */
function extraFilter(prop, opts) {
  // check within node_modules
  if (opts.skipNodeModules) {
    return prop.declarations.some(d => !d.fileName.includes('node_modules'));
  }
  return true;
}
var _default = (filePath, _ref = {}) => {
  var _ctx$opts, _ctx$opts$apiParser;
  let componentName = _ref.componentName,
    filterOpts = _objectWithoutProperties(_ref, _excluded);
  let definitions = cacher.get(filePath);
  let localFilter = filterOpts;
  const globalFilter = (_ctx$opts = _context.default.opts) === null || _ctx$opts === void 0 ? void 0 : (_ctx$opts$apiParser = _ctx$opts.apiParser) === null || _ctx$opts$apiParser === void 0 ? void 0 : _ctx$opts$apiParser.propFilter;
  const isDefaultRegExp = new RegExp(`^${componentName}$`, 'i');
  switch (typeof globalFilter) {
    // always use global filter if it is funuction
    case 'function':
      localFilter = globalFilter;
      break;
    // merge passed opts & global opts, and create custom filter
    default:
      localFilter = (mergedOpts => (prop, component) => {
        const builtinFilter = (0, _buildFilter().buildFilter)({
          propFilter: mergedOpts
        });
        return builtinFilter(prop, component) && extraFilter(prop, mergedOpts);
      })(Object.assign({}, globalFilter, localFilter));
  }
  // use cache first
  if (!definitions) {
    let defaultDefinition;
    definitions = {};
    parser().withCompilerOptions({
      esModuleInterop: true,
      jsx: 'preserve'
    }, {
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      componentNameResolver: source => {
        // use parsed component name from remark pipeline as default export's displayName
        return DEFAULT_EXPORTS.includes(source.getName()) ? componentName : undefined;
      },
      propFilter: localFilter
    }).parse(filePath).forEach(item => {
      // convert result to IApiDefinition
      const exportName = isDefaultRegExp.test(item.displayName) ? 'default' : item.displayName;
      const props = Object.entries(item.props).map(([identifier, prop]) => {
        const result = {
          identifier
        };
        const fields = ['identifier', 'description', 'type', 'defaultValue', 'required'];
        const localeDescReg = /(?:^|\n+)@description\s+/;
        fields.forEach(field => {
          switch (field) {
            case 'type':
              result.type = prop.type.raw || prop.type.name;
              break;
            case 'description':
              // the workaround way for support locale description
              // detect locale description content, such as @description.zh-CN xxx
              if (localeDescReg.test(prop.description)) {
                // split by @description symbol
                const groups = prop.description.split(localeDescReg).filter(Boolean);
                groups === null || groups === void 0 ? void 0 : groups.forEach(str => {
                  const _str$match = str.match(/^(\.[\w-]+)?\s*([^]*)$/),
                    _str$match2 = _slicedToArray(_str$match, 3),
                    locale = _str$match2[1],
                    content = _str$match2[2];
                  result[`description${locale || ''}`] = content;
                });
              } else if (prop.description) {
                result.description = prop.description;
              }
              break;
            case 'defaultValue':
              if (prop[field]) {
                result.default = prop[field].value;
              }
              break;
            default:
              if (prop[field]) {
                result[field] = prop[field];
              }
          }
        });
        return result;
      });
      if (exportName === 'default') {
        defaultDefinition = props;
      } else {
        definitions[exportName] = props;
      }
    });
    // to make sure default export always in the top
    if (defaultDefinition) {
      definitions = Object.assign({
        default: defaultDefinition
      }, definitions);
    }
  }
  cacher.add(filePath, definitions);
  return definitions;
};
exports.default = _default;