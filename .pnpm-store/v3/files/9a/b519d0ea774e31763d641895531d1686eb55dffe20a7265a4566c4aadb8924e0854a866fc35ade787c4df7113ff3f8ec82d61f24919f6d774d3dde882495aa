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
function _define() {
  const data = require("codesandbox/lib/api/define");
  _define = function _define() {
    return data;
  };
  return data;
}
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
const CSB_API_ENDPOINT = 'https://codesandbox.io/api/v1/sandboxes/define';
/**
 * 在 react 18 中需要新的 render 方式，这个函数用来处理不同的 jsx 模式。
 * @param  { 'react-dom' | 'react-dom/client'} clientRender
 * @returns code string
 */
const genReactRenderCode = (clientRender, extraCode) => {
  if (clientRender === 'react-dom') {
    return `/**
* This is an auto-generated demo by dumi
* if you think it is not working as expected,
* please report the issue at
* https://github.com/umijs/dumi/issues
**/
    
import React from 'react';
import ReactDOM from 'react-dom';
${extraCode}
import App from './App';
    
ReactDOM.render(
  <App />,
  document.getElementById('root'),
);`;
  }
  if (clientRender === 'react-dom/client') {
    return `/**
* This is an auto-generated demo by dumi
* if you think it is not working as expected,
* please report the issue at
* https://github.com/umijs/dumi/issues
**/
import React from 'react';
import { createRoot } from "react-dom/client";
${extraCode}
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);`;
  }
};
function getTextContent(raw) {
  const elm = document.createElement('span');
  elm.innerHTML = raw;
  const text = elm.textContent;
  elm.remove();
  return text;
}
/**
 * get serialized data that use to submit to codesandbox.io
 * @param opts  previewer props
 */
function getCSBData(opts) {
  var _deps$reactDom;
  const isTSX = Boolean(opts.sources._.tsx);
  const ext = isTSX ? '.tsx' : '.jsx';
  const files = {};
  const deps = {};
  const CSSDeps = Object.values(opts.dependencies).filter(dep => dep.css);
  const appFileName = `App${ext}`;
  const entryFileName = `index${ext}`;
  // generate dependencies
  Object.entries(opts.dependencies).forEach(([dep, {
    version
  }]) => {
    deps[dep] = version;
  });
  // add react-dom dependency
  if (!deps['react-dom']) {
    deps['react-dom'] = deps.react || 'latest';
  }
  // append sandbox.config.json
  files['sandbox.config.json'] = {
    content: JSON.stringify({
      template: isTSX ? 'create-react-app-typescript' : 'create-react-app'
    }, null, 2),
    isBinary: false
  };
  // append package.json
  files['package.json'] = {
    content: JSON.stringify({
      name: opts.title,
      description: getTextContent(opts.description || 'An auto-generated demo by dumi'),
      main: entryFileName,
      dependencies: deps,
      // add TypeScript dependency if required, must in devDeps to avoid csb compile error
      devDependencies: isTSX ? {
        typescript: '^3'
      } : {}
    }, null, 2),
    isBinary: false
  };
  // append index.html
  files['index.html'] = {
    content: '<div style="margin: 16px;" id="root"></div>',
    isBinary: false
  };
  // append entry file
  files[entryFileName] = {
    content: genReactRenderCode(
    // react 18 需要使用新的 render 方式
    (deps === null || deps === void 0 ? void 0 : (_deps$reactDom = deps['react-dom']) === null || _deps$reactDom === void 0 ? void 0 : _deps$reactDom.startsWith('18.')) || deps.react === 'latest' ? 'react-dom/client' : 'react-dom', CSSDeps.map(({
      css
    }) => `import '${css}';`).join('\n')),
    isBinary: false
  };
  // append other imported local files
  Object.entries(opts.sources).forEach(([filename, {
    tsx,
    jsx,
    content
  }]) => {
    // handle primary content
    files[filename === '_' ? appFileName : filename] = {
      content: tsx || jsx || content,
      isBinary: false
    };
  });
  return (0, _define().getParameters)({
    files
  });
}
/**
 * use CodeSandbox.io
 * @param opts  previewer opts
 * @note  return a open function for open demo on codesandbox.io
 */
var _default = (opts, api = CSB_API_ENDPOINT) => {
  const _useState = (0, _react().useState)(),
    _useState2 = _slicedToArray(_useState, 2),
    handler = _useState2[0],
    setHandler = _useState2[1];
  (0, _react().useEffect)(() => {
    if (opts) {
      const form = document.createElement('form');
      const input = document.createElement('input');
      const data = getCSBData(opts);
      form.method = 'POST';
      form.target = '_blank';
      form.style.display = 'none';
      form.action = api;
      form.appendChild(input);
      form.setAttribute('data-demo', opts.title || '');
      input.name = 'parameters';
      input.value = data;
      document.body.appendChild(form);
      setHandler(() => () => form.submit());
      return () => form.remove();
    }
  }, [opts]);
  return handler;
};
exports.default = _default;