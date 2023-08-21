"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatJSXProps = exports.encodeImportRequire = exports.encodeHoistImport = exports.decodeImportRequireWithAutoDynamic = exports.decodeImportRequire = exports.decodeHoistImportToContent = exports.decodeHoistImport = exports.CHUNK_ID = void 0;
exports.isDynamicEnable = isDynamicEnable;
exports.isHoistImport = exports.isEncodeImport = void 0;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
    return data;
  };
  return data;
}
function _utils() {
  const data = require("@umijs/utils");
  _utils = function _utils() {
    return data;
  };
  return data;
}
var _context = _interopRequireDefault(require("../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable no-new-wrappers */
/**
 * transform props base on JSX rule
 * @param props   original props
 */
const formatJSXProps = props => {
  const OMIT_NULL_PROPS = ['alt', 'align'];
  return Object.keys(props || {}).reduce((result, key) => {
    // ignore useless empty props
    if (props[key] !== null || !OMIT_NULL_PROPS.includes(key)) {
      result[key] = props[key];
    }
    // use wrapper object for workaround implement raw props render
    // https://github.com/mapbox/jsxtreme-markdown/blob/main/packages/hast-util-to-jsx/index.js#L167
    if (!(props[key] instanceof String) && props[key] !== null && (typeof props[key] === 'object' || Array.isArray(props[key]))) {
      result[key] = new String(JSON.stringify(props[key]));
    }
    // join className to string
    if (key === 'className' && Array.isArray(props[key])) {
      result[key] = props[key].join(' ');
    }
    return result;
  }, {});
};
/**
 * get umi dynamicImport flag
 */
exports.formatJSXProps = formatJSXProps;
function isDynamicEnable() {
  var _ctx$umi, _ctx$umi$config;
  return Boolean((_ctx$umi = _context.default.umi) === null || _ctx$umi === void 0 ? void 0 : (_ctx$umi$config = _ctx$umi.config) === null || _ctx$umi$config === void 0 ? void 0 : _ctx$umi$config.dynamicImport);
}
/**
 * encode & decode import statement which need to hoist at the top of file
 */
const HOIST_ID = '^H^O^I^S^T^';
const encodeHoistImport = resolvePath => `import ${HOIST_ID} from '!!dumi-raw-code-loader!${(0, _utils().winPath)(resolvePath)}?dumi-raw-code'`;
exports.encodeHoistImport = encodeHoistImport;
const decodeHoistImport = (str, id) => str.replace(new RegExp(HOIST_ID.replace(/\^/g, '\\^'), 'g'), id);
exports.decodeHoistImport = decodeHoistImport;
const isHoistImport = str => str.startsWith(`import ${HOIST_ID} from`);
exports.isHoistImport = isHoistImport;
const decodeHoistImportToContent = str => {
  if (isHoistImport(str)) {
    var _str$match;
    const filePath = (_str$match = str.match(/dumi\-raw\-code\-loader!([^\?]+)\?/)) === null || _str$match === void 0 ? void 0 : _str$match[1];
    return _fs().default.readFileSync(filePath, 'utf-8').toString();
  }
  return str;
};
/**
 * encode import/require statement by dynamicImport, it can be decode to await import statement with chunkName
 */
exports.decodeHoistImportToContent = decodeHoistImportToContent;
const CHUNK_ID = '^C^H^U^N^K^';
exports.CHUNK_ID = CHUNK_ID;
const encodeImportRequire = resolvePath => `(${isDynamicEnable() ? `await import(${CHUNK_ID}` : 'require('}'${(0, _utils().winPath)(resolvePath)}')).default`;
exports.encodeImportRequire = encodeImportRequire;
const decodeImportRequire = (str, chunkName) => str.replace(new RegExp(CHUNK_ID.replace(/\^/g, '\\^'), 'g'), `/* webpackChunkName: "${chunkName}" */`);
exports.decodeImportRequire = decodeImportRequire;
const isEncodeImport = str => str.startsWith(`(await import(${CHUNK_ID}`);
exports.isEncodeImport = isEncodeImport;
const decodeImportRequireWithAutoDynamic = (str, chunkName) => isEncodeImport(str) ? `dynamic({
      loader: async () => ${decodeImportRequire(str, chunkName)},
      loading: () => null,
    })` : decodeImportRequire(str, chunkName);
exports.decodeImportRequireWithAutoDynamic = decodeImportRequireWithAutoDynamic;