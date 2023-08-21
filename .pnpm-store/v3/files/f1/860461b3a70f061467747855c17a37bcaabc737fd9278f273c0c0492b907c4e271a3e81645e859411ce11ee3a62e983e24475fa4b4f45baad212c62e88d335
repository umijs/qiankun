"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _utils() {
  const data = require("@umijs/utils");
  _utils = function _utils() {
    return data;
  };
  return data;
}
function _unified() {
  const data = _interopRequireDefault(require("unified"));
  _unified = function _unified() {
    return data;
  };
  return data;
}
function _remarkFrontmatter() {
  const data = _interopRequireDefault(require("remark-frontmatter"));
  _remarkFrontmatter = function _remarkFrontmatter() {
    return data;
  };
  return data;
}
function _remarkMath() {
  const data = _interopRequireDefault(require("remark-math"));
  _remarkMath = function _remarkMath() {
    return data;
  };
  return data;
}
function _rehypeMathjax() {
  const data = _interopRequireDefault(require("rehype-mathjax"));
  _rehypeMathjax = function _rehypeMathjax() {
    return data;
  };
  return data;
}
function _rehypeAutolinkHeadings() {
  const data = _interopRequireDefault(require("rehype-autolink-headings"));
  _rehypeAutolinkHeadings = function _rehypeAutolinkHeadings() {
    return data;
  };
  return data;
}
function _rehypeRemoveComments() {
  const data = _interopRequireDefault(require("rehype-remove-comments"));
  _rehypeRemoveComments = function _rehypeRemoveComments() {
    return data;
  };
  return data;
}
function _rehypeStringify() {
  const data = _interopRequireDefault(require("rehype-stringify"));
  _rehypeStringify = function _rehypeStringify() {
    return data;
  };
  return data;
}
function _remarkParse() {
  const data = _interopRequireDefault(require("remark-parse"));
  _remarkParse = function _remarkParse() {
    return data;
  };
  return data;
}
function _remarkGfm() {
  const data = _interopRequireDefault(require("remark-gfm"));
  _remarkGfm = function _remarkGfm() {
    return data;
  };
  return data;
}
var _rehype = _interopRequireDefault(require("./rehype"));
var _slug = _interopRequireDefault(require("./slug"));
var _meta = _interopRequireDefault(require("./meta"));
var _codeBlock = _interopRequireDefault(require("./codeBlock"));
var _code = _interopRequireDefault(require("./code"));
var _embed = _interopRequireDefault(require("./embed"));
var _api = _interopRequireDefault(require("./api"));
var _mdComponent = _interopRequireDefault(require("./mdComponent"));
var _link = _interopRequireDefault(require("./link"));
var _img = _interopRequireDefault(require("./img"));
var _table = _interopRequireDefault(require("./table"));
var _previewer = _interopRequireDefault(require("./previewer"));
var _raw = _interopRequireDefault(require("./raw"));
var _jsxify = _interopRequireDefault(require("./jsxify"));
var _isolation = _interopRequireDefault(require("./isolation"));
var _domWarn = _interopRequireDefault(require("./domWarn"));
var _sourceCode = _interopRequireDefault(require("./sourceCode"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const log = (0, _utils().createDebug)('dumi:remark');
function debug(name) {
  return function debugPlugin() {
    return () => {
      if (this.data('fileAbsPath')) {
        log(name, this.data('fileAbsPath'));
      }
    };
  };
}
var _default = (source, fileAbsPath, type, masterKey) => {
  const rehypeCompiler = {
    jsx: [_jsxify.default],
    html: [_rehypeStringify().default, {
      allowDangerousHtml: true,
      closeSelfClosing: true
    }]
  }[type];
  const processor = (0, _unified().default)()
  // parse to remark
  .use(_remarkParse().default).use(debug('parse')).use(_remarkGfm().default).use(debug('gfm'))
  // remark plugins
  .use(_remarkFrontmatter().default).use(debug('frontmatter')).use(_remarkMath().default).use(debug('math')).use(_meta.default).use(debug('meta')).use(_codeBlock.default).use(debug('codeBlock'))
  // remark to rehype
  .use(_rehype.default).use(debug('rehype'))
  // rehype plugins
  .use(_rehypeMathjax().default).use(debug('mathjax')).use(_sourceCode.default).use(debug('sourceCode')).use(_raw.default).use(debug('raw')).use(_domWarn.default).use(debug('domWarn')).use(_rehypeRemoveComments().default, {
    removeConditional: true
  }).use(debug('comments')).use(_code.default).use(debug('code')).use(_api.default).use(debug('api')).use(_mdComponent.default).use(_slug.default).use(debug('slug')).use(_embed.default).use(debug('embed')).use(_rehypeAutolinkHeadings().default).use(debug('headings')).use(_link.default).use(debug('link')).use(_img.default).use(debug('img')).use(_table.default).use(debug('table')).use(_previewer.default).use(debug('previewer')).use(_isolation.default).use(debug('isolation')).data('masterKey', masterKey).data('fileAbsPath', fileAbsPath).data('outputType', type);
  // apply compiler via type
  processor.use(rehypeCompiler[0], rehypeCompiler[1]);
  const result = processor.processSync(source);
  debug('compiler').call(processor);
  return result;
};
exports.default = _default;