"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
var _transformer = _interopRequireDefault(require("../transformer"));
var _loader2 = _interopRequireDefault(require("../theme/loader"));
var _getFileContent = require("../utils/getFileContent");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function loader(_x) {
  return _loader.apply(this, arguments);
}
function _loader() {
  _loader = _asyncToGenerator(function* (raw) {
    let content = raw;
    const params = new URLSearchParams(this.resourceQuery);
    const range = params.get('range');
    const regexp = params.get('regexp');
    // extract content of markdown file
    if (range) {
      content = (0, _getFileContent.getFileRangeLines)(content, range);
    } else if (regexp) {
      content = (0, _getFileContent.getFileContentByRegExp)(content, regexp, this.resourcePath);
    }
    const result = _transformer.default.markdown(content, this.resourcePath, {
      cacheKey: this.resource,
      throwError: true,
      masterKey: params.get('master')
    });
    const theme = yield (0, _loader2.default)();
    return `
    import React from 'react';
    import { dynamic } from 'dumi';
    import { Link, AnchorLink, context } from 'dumi/theme';
    ${theme.builtins.concat(theme.fallbacks).concat(theme.customs).map(component => `import ${component.identifier} from '${component.source}';`).join('\n')}

    // memo for page content, to avoid useless re-render since other context fields changed
    const PageContent = React.memo(({ demos: DUMI_ALL_DEMOS }) => {
      ${(result.meta.demos || []).map(item => `const ${item.name} = ${item.code}`).join('\n')}

      return (
        <>
          ${(result.meta.translateHelp || '') && `<Alert>${typeof result.meta.translateHelp === 'string' ? result.meta.translateHelp : 'This article has not been translated yet. Want to help us out? Click the Edit this doc on GitHub at the end of the page.'}</Alert>`}
          ${result.content}
        </>
      );
    })

    export default (props) => {
      const { demos } = React.useContext(context);

      // scroll to anchor after page component loaded
      React.useEffect(() => {
        if (props?.location?.hash) {
          AnchorLink.scrollToAnchor(decodeURIComponent(props.location.hash.slice(1)));
        }
      }, []);

      return <PageContent demos={demos} />;
  }`;
  });
  return _loader.apply(this, arguments);
}