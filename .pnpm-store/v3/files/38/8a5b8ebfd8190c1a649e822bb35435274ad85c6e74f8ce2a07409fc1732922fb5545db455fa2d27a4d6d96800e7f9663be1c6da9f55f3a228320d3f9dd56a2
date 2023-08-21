"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripBasename = stripBasename;
Object.defineProperty(exports, "cheerio", {
  enumerable: true,
  get: function get() {
    return _cheerio().default;
  }
});
exports.handleHTML = exports.ReadableString = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
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

function _os() {
  const data = require("os");

  _os = function _os() {
    return data;
  };

  return data;
}

function _url() {
  const data = require("url");

  _url = function _url() {
    return data;
  };

  return data;
}

function _mergeStream() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/merge-stream"));

  _mergeStream = function _mergeStream() {
    return data;
  };

  return data;
}

function _serializeJavascript() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/serialize-javascript"));

  _serializeJavascript = function _serializeJavascript() {
    return data;
  };

  return data;
}

var _constants = require("../constants");

function _cheerio() {
  const data = _interopRequireDefault(require("@umijs/utils/lib/cheerio/cheerio"));

  _cheerio = function _cheerio() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
} // from react-router


function stripBasename(basename, path) {
  var _location$pathname;

  const location = (0, _url().parse)(path);
  if (!basename) return location;
  const base = addLeadingSlash(basename);
  if ((location === null || location === void 0 ? void 0 : (_location$pathname = location.pathname) === null || _location$pathname === void 0 ? void 0 : _location$pathname.indexOf(base)) !== 0) return location;
  return _objectSpread(_objectSpread({}, location), {}, {
    pathname: addLeadingSlash(location.pathname.substr(base.length))
  });
}

class ReadableString extends _stream().Readable {
  constructor(str) {
    super();
    this.str = void 0;
    this.sent = void 0;
    this.str = str;
    this.sent = false;
  }

  _read() {
    if (!this.sent) {
      this.push(Buffer.from(this.str));
      this.sent = true;
    } else {
      this.push(null);
    }
  }

}

exports.ReadableString = ReadableString;

/**
 * get page chunks with routes
 *
 * @param routeMatched
 */
const getPageChunks = routeMatched => {
  const chunks = [];

  const recursive = routes => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];

      if ((route === null || route === void 0 ? void 0 : route._chunkName) && chunks.indexOf(route._chunkName) < 0) {
        chunks.push(route._chunkName);
      }

      if (Array.isArray(route === null || route === void 0 ? void 0 : route.wrappers) && (route === null || route === void 0 ? void 0 : route.wrappers.length) > 0 && chunks.indexOf(_constants.WRAPPERS_CHUNK_NAME) < 0) {
        chunks.push(_constants.WRAPPERS_CHUNK_NAME);
      }
    }
  };

  recursive(routeMatched);
  return chunks;
};
/**
 * handle html with rootContainer(rendered)
 * @param param
 */


const handleHTML = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (opts = {}) {
    const pageInitialProps = opts.pageInitialProps,
          rootContainer = opts.rootContainer,
          mountElementId = opts.mountElementId,
          mode = opts.mode,
          forceInitial = opts.forceInitial,
          removeWindowInitialProps = opts.removeWindowInitialProps,
          routesMatched = opts.routesMatched,
          dynamicImport = opts.dynamicImport,
          manifest = opts.manifest;
    let html = opts.html;

    if (typeof html !== 'string') {
      return '';
    }

    const windowInitialVars = _objectSpread({}, pageInitialProps && !removeWindowInitialProps ? {
      'window.g_initialProps': (0, _serializeJavascript().default)(forceInitial ? null : pageInitialProps)
    } : {}); // get chunks in `dynamicImport: {}`


    if (dynamicImport && Array.isArray(routesMatched)) {
      const chunks = getPageChunks(routesMatched.map(routeMatched => routeMatched === null || routeMatched === void 0 ? void 0 : routeMatched.route)); // @ts-ignore

      const assets = manifest === null || manifest === void 0 ? void 0 : manifest._chunksMap;

      if ((chunks === null || chunks === void 0 ? void 0 : chunks.length) > 0) {
        // only load css chunks to avoid page flashing
        const cssChunkSet = [];
        chunks.forEach(chunk => {
          if (!assets || !Array.isArray(assets[chunk])) return;
          assets[chunk].forEach(resource => {
            if (/\.css$/.test(resource)) cssChunkSet.push(`<link rel="preload" href="${resource}" as="style" /><link rel="stylesheet" href="${resource}" />`);
          });
        }); // avoid repeat

        html = html.replace('</head>', `${cssChunkSet.join(_os().EOL)}${_os().EOL}</head>`);
      }
    }

    const rootHTML = `<div id="${mountElementId}"></div>`;
    const scriptsContent = `\n\t<script>
  window.g_useSSR = true;
  ${Object.keys(windowInitialVars).map(name => `${name} = ${windowInitialVars[name]};`).join('\n')}\n\t</script>`;

    if (mode === 'stream') {
      const _html$split = html.split(rootHTML),
            _html$split2 = _slicedToArray(_html$split, 2),
            beforeRootContainer = _html$split2[0],
            afterRootContainer = _html$split2[1];

      const streamQueue = [beforeRootContainer, `<div id="${mountElementId}">`, rootContainer, `</div>`, scriptsContent, afterRootContainer].map(item => typeof item === 'string' ? new ReadableString(item) : item);
      const htmlStream = (0, _mergeStream().default)(streamQueue);
      return htmlStream;
    } // https://github.com/umijs/umi/issues/5840


    const newRootHTML = `<div id="${mountElementId}">${rootContainer}</div>${scriptsContent}`.replace(/\$/g, '$$$');
    return html.replace(rootHTML, newRootHTML);
  });

  return function handleHTML() {
    return _ref.apply(this, arguments);
  };
}();

exports.handleHTML = handleHTML;