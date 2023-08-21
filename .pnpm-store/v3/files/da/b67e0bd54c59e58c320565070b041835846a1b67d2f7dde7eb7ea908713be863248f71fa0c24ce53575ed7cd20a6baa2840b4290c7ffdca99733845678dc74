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

function _ejs() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/ejs"));

  _ejs = function _ejs() {
    return data;
  };

  return data;
}

function _prettier() {
  const data = _interopRequireDefault(require("@umijs/deps/reexported/prettier"));

  _prettier = function _prettier() {
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

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
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

const _excluded = ["content"],
      _excluded2 = ["content"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

class Html {
  constructor(opts) {
    this.config = void 0;
    this.tplPath = void 0;
    this.config = opts.config;
    this.tplPath = opts.tplPath;
  }

  getHtmlPath(path) {
    if (path === '/') {
      return 'index.html';
    } // remove first and last slash


    path = path.replace(/^\//, '');
    path = path.replace(/\/$/, '');

    if (this.config.exportStatic && this.config.exportStatic.htmlSuffix || path === 'index.html') {
      return `${path}`;
    } else {
      return `${path}/index.html`;
    }
  }

  getRelPathToPublicPath(path) {
    const htmlPath = this.getHtmlPath(path);
    const len = htmlPath.split('/').length;
    return Array(this.config.exportStatic && this.config.exportStatic.htmlSuffix ? len : len - 1).join('../') || './';
  }

  getAsset(opts) {
    if (/^https?:\/\//.test(opts.file)) {
      return opts.file;
    }

    const file = opts.file.charAt(0) === '/' ? opts.file.slice(1) : opts.file;

    if (this.config.exportStatic && this.config.exportStatic.dynamicRoot) {
      return `${this.getRelPathToPublicPath(opts.path || '/')}${file}`;
    } else {
      return `${this.config.publicPath}${file}`;
    }
  }

  getScriptsContent(scripts) {
    return scripts.map(script => {
      const content = script.content,
            attrs = _objectWithoutProperties(script, _excluded);

      if (content && !attrs.src) {
        const newAttrs = Object.keys(attrs).reduce((memo, key) => {
          return [...memo, `${key}="${attrs[key]}"`];
        }, []);
        return [`<script${newAttrs.length ? ' ' : ''}${newAttrs.join(' ')}>`, content.split('\n').map(line => `  ${line}`).join('\n'), '</script>'].join('\n');
      } else {
        const newAttrs = Object.keys(attrs).reduce((memo, key) => {
          return [...memo, `${key}="${attrs[key]}"`];
        }, []);
        return `<script ${newAttrs.join(' ')}></script>`;
      }
    }).join('\n');
  }

  getContent(args) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const route = args.route,
            _args$tplPath = args.tplPath,
            tplPath = _args$tplPath === void 0 ? _this.tplPath : _args$tplPath;
      let _args$metas = args.metas,
          metas = _args$metas === void 0 ? [] : _args$metas,
          _args$links = args.links,
          links = _args$links === void 0 ? [] : _args$links,
          _args$styles = args.styles,
          styles = _args$styles === void 0 ? [] : _args$styles,
          _args$headJSFiles = args.headJSFiles,
          headJSFiles = _args$headJSFiles === void 0 ? [] : _args$headJSFiles,
          _args$headScripts = args.headScripts,
          headScripts = _args$headScripts === void 0 ? [] : _args$headScripts,
          _args$scripts = args.scripts,
          scripts = _args$scripts === void 0 ? [] : _args$scripts,
          _args$jsFiles = args.jsFiles,
          jsFiles = _args$jsFiles === void 0 ? [] : _args$jsFiles,
          _args$cssFiles = args.cssFiles,
          cssFiles = _args$cssFiles === void 0 ? [] : _args$cssFiles;
      const config = _this.config;

      if (tplPath) {
        (0, _assert().default)((0, _fs().existsSync)(tplPath), `getContent() failed, tplPath of ${tplPath} not exists.`);
      }

      const tpl = (0, _fs().readFileSync)(tplPath || (0, _path().join)(__dirname, 'document.ejs'), 'utf-8');

      const context = _objectSpread({
        config
      }, config.exportStatic ? {
        route
      } : {});

      let html = _ejs().default.render(tpl, context, {
        _with: false,
        localsName: 'context',
        filename: 'document.ejs'
      });

      let $ = _utils().cheerio.load(html, {
        // @ts-ignore
        decodeEntities: false
      }); // metas


      metas.forEach(meta => {
        $('head').append(['<meta', ...Object.keys(meta).reduce((memo, key) => {
          return memo.concat(`${key}="${meta[key]}"`);
        }, []), '/>'].join(' '));
      }); // links

      links.forEach(link => {
        $('head').append(['<link', ...Object.keys(link).reduce((memo, key) => {
          return memo.concat(`${key}="${link[key]}"`);
        }, []), '/>'].join(' '));
      }); // styles

      styles.forEach(style => {
        const _style$content = style.content,
              content = _style$content === void 0 ? '' : _style$content,
              attrs = _objectWithoutProperties(style, _excluded2);

        const newAttrs = Object.keys(attrs).reduce((memo, key) => {
          return memo.concat(`${key}="${attrs[key]}"`);
        }, []);
        $('head').append([`<style${newAttrs.length ? ' ' : ''}${newAttrs.join(' ')}>`, content.split('\n').map(line => `  ${line}`).join('\n'), '</style>'].join('\n'));
      }); // css

      cssFiles.forEach(file => {
        $('head').append(`<link rel="stylesheet" href="${_this.getAsset({
          file,
          path: route.path
        })}" />`);
      }); // root element

      const mountElementId = config.mountElementId || 'root';

      if (!$(`#${mountElementId}`).length) {
        const bodyEl = $('body');
        (0, _assert().default)(bodyEl.length, `<body> not found in html template.`);
        bodyEl.append(`<div id="${mountElementId}"></div>`);
      } // js


      if (headScripts.length) {
        $('head').append(_this.getScriptsContent(headScripts));
      }

      headJSFiles.forEach(file => {
        $('head').append(`<script src="${_this.getAsset({
          file,
          path: route.path
        })}"></script>`);
      });

      if (scripts.length) {
        $('body').append(_this.getScriptsContent(scripts));
      }

      jsFiles.forEach(file => {
        $('body').append(`<script src="${_this.getAsset({
          file,
          path: route.path
        })}"></script>`);
      });

      if (args.modifyHTML) {
        $ = yield args.modifyHTML($, {
          route
        });
      }

      html = $.html(); // Node 8 not support prettier v2
      // https://github.com/prettier/eslint-plugin-prettier/issues/278

      try {
        html = _prettier().default.format(html, {
          parser: 'html'
        });
      } catch (_) {}

      return html;
    })();
  }

}

var _default = Html;
exports.default = _default;