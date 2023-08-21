"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseElmAttrToProps = void 0;
const ATTR_MAPPING = {
  hideactions: 'hideActions',
  defaultshowcode: 'defaultShowCode',
  skipnodemodules: 'skipNodeModules',
  skippropswithoutdoc: 'skipPropsWithoutDoc',
  hidetitle: 'hideTitle',
  demourl: 'demoUrl'
};
/**
 * parse custome HTML element attributes to properties
 * @note  1. empty attribute will convert to true
 *        2. JSON-like string will convert to JSON
 *        3. workaround for restore property to camlCase that caused by hast-util-raw
 * @param   attrs   original attributes
 * @return  parsed properties
 */
const parseElmAttrToProps = attrs => {
  const parsed = Object.assign({}, attrs);
  // restore camelCase attrs, because hast-util-raw will transform camlCase to lowercase
  Object.entries(ATTR_MAPPING).forEach(([mark, attr]) => {
    if (parsed[mark] !== undefined) {
      parsed[attr] = parsed[mark];
      delete parsed[mark];
    }
  });
  // convert empty string to boolean
  Object.keys(parsed).forEach(attr => {
    if (parsed[attr] === '') {
      parsed[attr] = true;
    }
  });
  // try to parse JSON field value
  Object.keys(parsed).forEach(attr => {
    if (/^(\[|{)[^]*(]|})$/.test(parsed[attr])) {
      try {
        parsed[attr] = JSON.parse(parsed[attr]);
      } catch (err) {
        /* nothing */
      }
    }
  });
  return parsed;
};
exports.parseElmAttrToProps = parseElmAttrToProps;