"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = domWarn;
function _unistUtilVisitParents() {
  const data = _interopRequireDefault(require("unist-util-visit-parents"));
  _unistUtilVisitParents = function _unistUtilVisitParents() {
    return data;
  };
  return data;
}
function _hastUtilIsElement() {
  const data = _interopRequireDefault(require("hast-util-is-element"));
  _hastUtilIsElement = function _hastUtilIsElement() {
    return data;
  };
  return data;
}
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const NO_PARAGRAPH_RULES = [{
  type: 'element',
  tagName: 'code',
  properties: {
    src: Boolean
  }
}, {
  type: 'element',
  tagName: 'embed',
  properties: {
    src: Boolean
  }
}, {
  type: 'element',
  tagName: 'API'
}];
/**
 * loose compare node properties for check matching
 * @param oProps  original properties
 * @param eProps  equal properties
 */
function looseCompareProps(oProps, eProps) {
  return Object.entries(eProps).every(([name, value]) => {
    if (typeof value !== 'object') {
      return typeof value === 'function' ? value(oProps[name]) : oProps[name] === value;
    }
    return looseCompareProps(oProps[name], value);
  });
}
/**
 * rehype plugin for prevent DOM validation warnings from React
 * @note  semantic DOM nesting relationship
 */
function domWarn() {
  return ast => {
    (0, _unistUtilVisitParents().default)(ast, 'element', (node, ancestors) => {
      // only process the p elements below the root
      if ((0, _hastUtilIsElement().default)(node, 'p') && ancestors[0].type === 'root' && ancestors.length === 1) {
        const nodes = [];
        // visit all children for p element
        node.children.forEach(child => {
          if (NO_PARAGRAPH_RULES.some(rule => looseCompareProps(child, rule))) {
            // hoist to parent level for matched node
            nodes.push(child);
          } else {
            // push empty p element if there has not valid p element
            if (!nodes.length || !(0, _hastUtilIsElement().default)(nodes[nodes.length - 1], 'p')) {
              // FIXME: make sure the position data correctly
              nodes.push(_objectSpread(_objectSpread({}, node), {}, {
                children: []
              }));
            }
            // push child into p element
            nodes[nodes.length - 1].children.push(child);
          }
        });
        // replace original p element if there has matched node(s)
        if (nodes.length > 1 || !(0, _hastUtilIsElement().default)(nodes[0], 'p')) {
          const parent = ancestors[ancestors.length - 1];
          parent.children.splice(parent.children.indexOf(node), 1, ...nodes);
        }
        return _unistUtilVisitParents().default.SKIP;
      }
    });
  };
}