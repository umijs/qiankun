"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _list = _interopRequireDefault(require("postcss/lib/list"));

var _balancedMatch = _interopRequireDefault(require("balanced-match"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function explodeSelector(pseudoClass, selector) {
  const position = locatePseudoClass(selector, pseudoClass);

  if (selector && position > -1) {
    const pre = selector.slice(0, position);
    const matches = (0, _balancedMatch.default)("(", ")", selector.slice(position));

    if (!matches) {
      return selector;
    }

    const bodySelectors = matches.body ? _list.default.comma(matches.body).map(s => explodeSelector(pseudoClass, s)).join(`)${pseudoClass}(`) : "";
    const postSelectors = matches.post ? explodeSelector(pseudoClass, matches.post) : "";
    return `${pre}${pseudoClass}(${bodySelectors})${postSelectors}`;
  }

  return selector;
}

const patternCache = {};

function locatePseudoClass(selector, pseudoClass) {
  patternCache[pseudoClass] = patternCache[pseudoClass] || new RegExp(`([^\\\\]|^)${pseudoClass}`); // The regex is used to ensure that selectors with
  // escaped colons in them are treated properly
  // Ex: .foo\:not-bar is a valid CSS selector
  // But it is not a reference to a pseudo selector

  const pattern = patternCache[pseudoClass];
  const position = selector.search(pattern);

  if (position === -1) {
    return -1;
  } // The offset returned by the regex may be off by one because
  // of it including the negated character match in the position


  return position + selector.slice(position).indexOf(pseudoClass);
}

function explodeSelectors(pseudoClass) {
  return () => {
    return {
      postcssPlugin: "postcss-selector-not",
      Rule: rule => {
        if (rule.selector && rule.selector.indexOf(pseudoClass) > -1) {
          rule.selector = explodeSelector(pseudoClass, rule.selector);
        }
      }
    };
  };
}

const creator = explodeSelectors(":not");
creator.postcss = true;
var _default = creator;
exports.default = _default;