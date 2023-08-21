"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = api;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
    return data;
  };
  return data;
}
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
    return data;
  };
  return data;
}
function _deepmerge() {
  const data = _interopRequireDefault(require("deepmerge"));
  _deepmerge = function _deepmerge() {
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
function _hastUtilHasProperty() {
  const data = _interopRequireDefault(require("hast-util-has-property"));
  _hastUtilHasProperty = function _hastUtilHasProperty() {
    return data;
  };
  return data;
}
function _unistUtilVisit() {
  const data = _interopRequireDefault(require("unist-util-visit"));
  _unistUtilVisit = function _unistUtilVisit() {
    return data;
  };
  return data;
}
var _utils = require("./utils");
var _apiParser = _interopRequireDefault(require("../../api-parser"));
var _moduleResolver = require("../../utils/moduleResolver");
var _watcher = require("../../utils/watcher");
var _context = _interopRequireDefault(require("../../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function applyApiData(identifier, definitions) {
  if (identifier && definitions) {
    var _ctx$umi;
    (_ctx$umi = _context.default.umi) === null || _ctx$umi === void 0 ? void 0 : _ctx$umi.applyPlugins({
      key: 'dumi.detectApi',
      type: _context.default.umi.ApplyPluginsType.event,
      args: {
        identifier,
        data: definitions
      }
    });
  }
}
/**
 * serialize api node to [title, node, title, node, ...]
 * @param node        original api node
 * @param identifier  api parse identifier, mapping in .umi/dumi/apis.json
 * @param definitions api definitions
 */
function serializeAPINodes(node, identifier, definitions) {
  const parsedAttrs = (0, _utils.parseElmAttrToProps)(node.properties);
  const expts = parsedAttrs.exports || Object.keys(definitions);
  const showTitle = !parsedAttrs.hideTitle;
  return expts.reduce((list, expt, i) => {
    // render large API title if it is default export
    // or it is the first export and the exports attribute was not custom
    const isInsertAPITitle = expt === 'default' || !i && !parsedAttrs.exports;
    // render sub title for non-default export
    const isInsertSubTitle = expt !== 'default';
    const apiNode = (0, _deepmerge().default)({}, node);
    // insert API title
    if (showTitle && isInsertAPITitle) {
      list.push({
        type: 'element',
        tagName: 'h2',
        properties: {},
        children: [{
          type: 'text',
          value: 'API'
        }]
      }, {
        type: 'text',
        value: '\n'
      });
    }
    // insert export sub title
    if (showTitle && isInsertSubTitle) {
      list.push({
        type: 'element',
        tagName: 'h3',
        properties: {
          id: `api-${expt.toLowerCase()}`
        },
        children: [{
          type: 'text',
          value: expt
        }]
      }, {
        type: 'text',
        value: '\n'
      });
    }
    // insert API Node
    delete apiNode.properties.exports;
    apiNode.properties.identifier = identifier;
    apiNode.properties.export = expt;
    apiNode._dumi_parsed = true;
    list.push(apiNode);
    return list;
  }, []);
}
/**
 * detect component name via file path
 */
function guessComponentName(fileAbsPath) {
  const parsed = _path().default.parse(fileAbsPath);
  if (['index', 'index.d'].includes(parsed.name)) {
    // button/index.tsx => button
    // packages/button/src/index.tsx => button
    // packages/button/lib/index.d.ts => button
    // windows: button\\src\\index.tsx => button
    // windows: button\\lib\\index.d.ts => button
    return _path().default.basename(parsed.dir.replace(/(\/|\\)(src|lib)$/, ''));
  }
  // components/button.tsx => button
  return parsed.name;
}
/**
 * watch component change to update api data
 * @param absPath       component absolute path
 * @param identifier    api identifier
 * @param parseOpts     extra parse options
 */
function watchComponentUpdate(absPath, identifier, parseOpts) {
  (0, _watcher.listenFileOnceChange)(absPath, () => {
    let definitions;
    try {
      definitions = (0, _apiParser.default)(absPath, parseOpts);
    } catch (err) {
      /* noting */
    }
    // update api data
    applyApiData(identifier, definitions);
    // watch next turn
    // FIXME: workaround for resolve no such file error
    /* istanbul ignore next */
    setTimeout(() => {
      watchComponentUpdate(absPath, identifier, parseOpts);
    }, _fs().default.existsSync(absPath) ? 0 : 50);
  });
}
/**
 * remark plugin for parse embed tag to external module
 */
function api() {
  return (ast, vFile) => {
    (0, _unistUtilVisit().default)(ast, 'element', (node, i, parent) => {
      if ((0, _hastUtilIsElement().default)(node, 'API') && !node._dumi_parsed) {
        let identifier;
        let definitions;
        const parseOpts = (0, _utils.parseElmAttrToProps)(node.properties);
        if ((0, _hastUtilHasProperty().default)(node, 'src')) {
          const src = node.properties.src || '';
          let absPath = _path().default.join(_path().default.dirname(this.data('fileAbsPath')), src);
          try {
            absPath = (0, _moduleResolver.getModuleResolvePath)({
              basePath: process.cwd(),
              sourcePath: src,
              silent: true
            });
          } catch (err) {
            // nothing
          }
          // guess component name if there has no identifier property
          const componentName = node.properties.identifier || guessComponentName(absPath);
          parseOpts.componentName = componentName;
          definitions = (0, _apiParser.default)(absPath, parseOpts);
          identifier = componentName || src;
          // trigger listener to update previewer props after this file changed
          watchComponentUpdate(absPath, identifier, parseOpts);
        } else if (vFile.data.componentName) {
          try {
            const sourcePath = (0, _moduleResolver.getModuleResolvePath)({
              basePath: process.cwd(),
              sourcePath: _path().default.dirname(this.data('fileAbsPath')),
              silent: true
            });
            parseOpts.componentName = vFile.data.componentName;
            definitions = (0, _apiParser.default)(sourcePath, parseOpts);
            identifier = vFile.data.componentName;
            // trigger listener to update previewer props after this file changed
            watchComponentUpdate(sourcePath, identifier, parseOpts);
          } catch (err) {
            /* noting */
          }
        }
        if (identifier && definitions) {
          // replace original node
          parent.children.splice(i, 1, ...serializeAPINodes(node, identifier, definitions));
          // apply api data
          applyApiData(identifier, definitions);
        }
      }
    });
  };
}