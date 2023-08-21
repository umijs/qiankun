"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepUniq = deepUniq;
exports.getStyles = exports.getScripts = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EXP_URL = /^(http:|https:)?\/\//;

function deepUniq(collection) {
  return _utils().lodash.uniqWith(collection, _utils().lodash.isEqual);
}
/**
 * 格式化 script => object
 * @param option Array<string | IScript>
 */


const getScripts = option => {
  if (Array.isArray(option) && option.length > 0) {
    const scripts = option.filter(script => !_utils().lodash.isEmpty(script)).map(aScript => {
      if (typeof aScript === 'string') {
        return EXP_URL.test(aScript) ? {
          src: aScript
        } : {
          content: aScript
        };
      } // [{ content: '', async: true, crossOrigin: true }]


      return aScript;
    });
    return deepUniq(scripts);
  }

  return [];
};
/**
 * 格式化 styles => [linkObject, styleObject]
 * @param option Array<string | ILink>
 */


exports.getScripts = getScripts;

const getStyles = option => {
  const linkArr = [];
  const styleObj = [];

  if (Array.isArray(option) && option.length > 0) {
    option.forEach(style => {
      if (typeof style === 'string') {
        if (EXP_URL.test(style)) {
          // is <link />
          linkArr.push({
            charset: 'utf-8',
            rel: 'stylesheet',
            type: 'text/css',
            href: style
          });
        } else {
          styleObj.push({
            content: style
          });
        }
      }

      if (typeof style === 'object') {
        // is style object
        styleObj.push(style);
      }
    });
  }

  return [deepUniq(linkArr), deepUniq(styleObj)];
};

exports.getStyles = getStyles;