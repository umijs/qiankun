"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = exports.ScopedCSS = exports.QiankunCSSRewriteAttr = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
/**
 * @author Saviio
 * @since 2020-4-19
 */
// https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
var RuleType;
(function (RuleType) {
  // type: rule will be rewrote
  RuleType[RuleType["STYLE"] = 1] = "STYLE";
  RuleType[RuleType["MEDIA"] = 4] = "MEDIA";
  RuleType[RuleType["SUPPORTS"] = 12] = "SUPPORTS";
  // type: value will be kept
  RuleType[RuleType["IMPORT"] = 3] = "IMPORT";
  RuleType[RuleType["FONT_FACE"] = 5] = "FONT_FACE";
  RuleType[RuleType["PAGE"] = 6] = "PAGE";
  RuleType[RuleType["KEYFRAMES"] = 7] = "KEYFRAMES";
  RuleType[RuleType["KEYFRAME"] = 8] = "KEYFRAME";
})(RuleType || (RuleType = {}));
var arrayify = function arrayify(list) {
  return [].slice.call(list, 0);
};
var rawDocumentBodyAppend = HTMLBodyElement.prototype.appendChild;
var ScopedCSS = exports.ScopedCSS = /*#__PURE__*/function () {
  function ScopedCSS() {
    (0, _classCallCheck2.default)(this, ScopedCSS);
    this.sheet = void 0;
    this.swapNode = void 0;
    var styleNode = document.createElement('style');
    rawDocumentBodyAppend.call(document.body, styleNode);
    this.swapNode = styleNode;
    this.sheet = styleNode.sheet;
    this.sheet.disabled = true;
  }
  (0, _createClass2.default)(ScopedCSS, [{
    key: "process",
    value: function process(styleNode) {
      var _this = this;
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      if (ScopedCSS.ModifiedTag in styleNode) {
        return;
      }
      if (styleNode.textContent !== '') {
        var _sheet$cssRules;
        var textNode = document.createTextNode(styleNode.textContent || '');
        this.swapNode.appendChild(textNode);
        var sheet = this.swapNode.sheet; // type is missing
        var rules = arrayify((_sheet$cssRules = sheet === null || sheet === void 0 ? void 0 : sheet.cssRules) !== null && _sheet$cssRules !== void 0 ? _sheet$cssRules : []);
        var css = this.rewrite(rules, prefix);
        // eslint-disable-next-line no-param-reassign
        styleNode.textContent = css;
        // cleanup
        this.swapNode.removeChild(textNode);
        styleNode[ScopedCSS.ModifiedTag] = true;
        return;
      }
      var mutator = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i += 1) {
          var mutation = mutations[i];
          if (ScopedCSS.ModifiedTag in styleNode) {
            return;
          }
          if (mutation.type === 'childList') {
            var _sheet$cssRules2;
            var _sheet = styleNode.sheet;
            var _rules = arrayify((_sheet$cssRules2 = _sheet === null || _sheet === void 0 ? void 0 : _sheet.cssRules) !== null && _sheet$cssRules2 !== void 0 ? _sheet$cssRules2 : []);
            var _css = _this.rewrite(_rules, prefix);
            // eslint-disable-next-line no-param-reassign
            styleNode.textContent = _css;
            // eslint-disable-next-line no-param-reassign
            styleNode[ScopedCSS.ModifiedTag] = true;
          }
        }
      });
      // since observer will be deleted when node be removed
      // we dont need create a cleanup function manually
      // see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect
      mutator.observe(styleNode, {
        childList: true
      });
    }
  }, {
    key: "rewrite",
    value: function rewrite(rules) {
      var _this2 = this;
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var css = '';
      rules.forEach(function (rule) {
        switch (rule.type) {
          case RuleType.STYLE:
            css += _this2.ruleStyle(rule, prefix);
            break;
          case RuleType.MEDIA:
            css += _this2.ruleMedia(rule, prefix);
            break;
          case RuleType.SUPPORTS:
            css += _this2.ruleSupport(rule, prefix);
            break;
          default:
            if (typeof rule.cssText === 'string') {
              css += "".concat(rule.cssText);
            }
            break;
        }
      });
      return css;
    }
    // handle case:
    // .app-main {}
    // html, body {}
    // eslint-disable-next-line class-methods-use-this
  }, {
    key: "ruleStyle",
    value: function ruleStyle(rule, prefix) {
      var rootSelectorRE = /((?:[^\w\-.#]|^)(body|html|:root))/gm;
      var rootCombinationRE = /(html[^\w{[]+)/gm;
      var selector = rule.selectorText.trim();
      var cssText = '';
      if (typeof rule.cssText === 'string') {
        cssText = rule.cssText;
      }
      // handle html { ... }
      // handle body { ... }
      // handle :root { ... }
      if (selector === 'html' || selector === 'body' || selector === ':root') {
        return cssText.replace(rootSelectorRE, prefix);
      }
      // handle html body { ... }
      // handle html > body { ... }
      if (rootCombinationRE.test(rule.selectorText)) {
        var siblingSelectorRE = /(html[^\w{]+)(\+|~)/gm;
        // since html + body is a non-standard rule for html
        // transformer will ignore it
        if (!siblingSelectorRE.test(rule.selectorText)) {
          cssText = cssText.replace(rootCombinationRE, '');
        }
      }
      // handle grouping selector, a,span,p,div { ... }
      cssText = cssText.replace(/^[\s\S]+{/, function (selectors) {
        return selectors.replace(/(^|,\n?)([^,]+)/g, function (item, p, s) {
          // handle div,body,span { ... }
          if (rootSelectorRE.test(item)) {
            return item.replace(rootSelectorRE, function (m) {
              // do not discard valid previous character, such as body,html or *:not(:root)
              var whitePrevChars = [',', '('];
              if (m && whitePrevChars.includes(m[0])) {
                return "".concat(m[0]).concat(prefix);
              }
              // replace root selector with prefix
              return prefix;
            });
          }
          return "".concat(p).concat(prefix, " ").concat(s.replace(/^ */, ''));
        });
      });
      return cssText;
    }
    // handle case:
    // @media screen and (max-width: 300px) {}
  }, {
    key: "ruleMedia",
    value: function ruleMedia(rule, prefix) {
      var css = this.rewrite(arrayify(rule.cssRules), prefix);
      return "@media ".concat(rule.conditionText || rule.media.mediaText, " {").concat(css, "}");
    }
    // handle case:
    // @supports (display: grid) {}
  }, {
    key: "ruleSupport",
    value: function ruleSupport(rule, prefix) {
      var css = this.rewrite(arrayify(rule.cssRules), prefix);
      return "@supports ".concat(rule.conditionText || rule.cssText.split('{')[0], " {").concat(css, "}");
    }
  }]);
  return ScopedCSS;
}();
ScopedCSS.ModifiedTag = 'Symbol(style-modified-qiankun)';
var processor;
var QiankunCSSRewriteAttr = exports.QiankunCSSRewriteAttr = 'data-qiankun';
var process = exports.process = function process(appWrapper, stylesheetElement, appName) {
  // lazy singleton pattern
  if (!processor) {
    processor = new ScopedCSS();
  }
  if (stylesheetElement.tagName === 'LINK') {
    console.warn('Feature: sandbox.experimentalStyleIsolation is not support for link element yet.');
  }
  var mountDOM = appWrapper;
  if (!mountDOM) {
    return;
  }
  var tag = (mountDOM.tagName || '').toLowerCase();
  if (tag && stylesheetElement.tagName === 'STYLE') {
    var prefix = "".concat(tag, "[").concat(QiankunCSSRewriteAttr, "=\"").concat(appName, "\"]");
    processor.process(stylesheetElement, prefix);
  }
};