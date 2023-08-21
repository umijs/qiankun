"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = link;
function _unistUtilVisit() {
  const data = _interopRequireDefault(require("unist-util-visit"));
  _unistUtilVisit = function _unistUtilVisit() {
    return data;
  };
  return data;
}
function _hastUtilToHtml() {
  const data = _interopRequireDefault(require("hast-util-to-html"));
  _hastUtilToHtml = function _hastUtilToHtml() {
    return data;
  };
  return data;
}
function _hastUtilHasProperty() {
  const data = _interopRequireDefault(require("hast-util-has-property"));
  _hastUtilHasProperty = function _hastUtilHasProperty() {
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
function _url() {
  const data = _interopRequireDefault(require("url"));
  _url = function _url() {
    return data;
  };
  return data;
}
var _raw = _interopRequireDefault(require("./raw"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function link() {
  return (ast, vFile) => {
    (0, _unistUtilVisit().default)(ast, 'element', (node, i, parent) => {
      // handle internal link, external link & anchor link
      if ((0, _hastUtilIsElement().default)(node, 'a') && (0, _hastUtilHasProperty().default)(node, 'href')) {
        let LinkComponent = 'Link';
        const parsedUrl = _url().default.parse(node.properties.href);
        const children = (node.children || []).map(n => (0, _hastUtilToHtml().default)(n)).join('');
        let properties = Object.keys(node.properties).filter(prop => !['href'].includes(prop)).map(prop => `${prop}="${node.properties[prop]}"`).join(' ');
        // compatible with normal markdown link
        // see https://github.com/umijs/dumi/issues/181
        // TODO: https://github.com/umijs/dumi/issues/238
        if (/\.md$/i.test(parsedUrl.pathname) && !/^(\w+:)?\/\//.test(node.properties.href)) {
          parsedUrl.pathname = parsedUrl.pathname.replace(/\.md$/i, '');
        }
        // handle internal anchor link
        if (parsedUrl.hash && !parsedUrl.hostname) {
          LinkComponent = 'AnchorLink';
        }
        // replace original node
        if (this.data('outputType') === 'jsx') {
          parent.children[i] = (0, _raw.default)()({
            type: 'raw',
            value: `<${LinkComponent} to="${_url().default.format(parsedUrl)}" ${properties}>${children}</${LinkComponent}>`
          }, vFile);
        } else if (this.data('outputType') === 'html') {
          if (parsedUrl.hostname) {
            properties += ' target="_blank"';
          }
          parent.children[i] = (0, _raw.default)()({
            type: 'raw',
            value: `<a href="${_url().default.format(parsedUrl)}" ${properties}>${children}${parsedUrl.hostname ? (0, _hastUtilToHtml().default)({
              type: 'element',
              tagName: 'svg',
              properties: {
                xmlns: 'http://www.w3.org/2000/svg',
                ariaHidden: true,
                x: '0px',
                y: '0px',
                viewBox: '0 0 100 100',
                width: 15,
                height: 15,
                className: `__dumi-default-external-link-icon`
              },
              children: [{
                type: 'element',
                tagName: 'path',
                properties: {
                  fill: 'currentColor',
                  d: 'M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z'
                }
              }, {
                type: 'element',
                tagName: 'polygon',
                properties: {
                  fill: 'currentColor',
                  points: '45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9'
                }
              }]
            }) : ''}</a>`
          }, vFile);
        }
      }
    });
  };
}