"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSSR = exports.getWindowInitialProps = exports.isBrowser = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * whether in browser env
 */
const isBrowser = () => typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined';
/**
 * get window.g_initialProps
 */


exports.isBrowser = isBrowser;

const getWindowInitialProps = () => isBrowser() ? window.g_initialProps : undefined;
/**
 * whether SSR success in client
 */


exports.getWindowInitialProps = getWindowInitialProps;

const isSSR = () => isBrowser() && window.g_useSSR;

exports.isSSR = isSSR;