"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = slug;
exports.getFilePathKey = getFilePathKey;
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
    return data;
  };
  return data;
}
function _slash() {
  const data = _interopRequireDefault(require("slash2"));
  _slash = function _slash() {
    return data;
  };
  return data;
}
function _githubSlugger() {
  const data = _interopRequireDefault(require("github-slugger"));
  _githubSlugger = function _githubSlugger() {
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
function _hastUtilToString() {
  const data = _interopRequireDefault(require("hast-util-to-string"));
  _hastUtilToString = function _hastUtilToString() {
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
var _context = _interopRequireDefault(require("../../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const sluggerStore = {};
function filterValidChildren(children) {
  return children.filter(item => {
    return item.type !== 'element' || !/^[A-Z]/.test(item.tagName);
  });
}
/**
 * get slugger instance for current file
 * @param fileAbsPath   current file absolute path
 * @param masterKey     master file key, use master slugger first to avoid slugs conflict by embed syntax
 */
function getSluggerIns(fileAbsPath, masterKey) {
  if (masterKey) {
    return sluggerStore[masterKey];
  }
  if (fileAbsPath) {
    const key = getFilePathKey(fileAbsPath);
    if (sluggerStore[key]) {
      sluggerStore[key].reset();
    } else {
      sluggerStore[key] = (0, _githubSlugger().default)();
    }
    return sluggerStore[key];
  }
  return (0, _githubSlugger().default)();
}
/**
 * get key from file absolute path
 * @param fileAbsPath   file absolute path
 */
function getFilePathKey(fileAbsPath) {
  var _ctx$umi;
  return (0, _slash().default)(_path().default.relative(((_ctx$umi = _context.default.umi) === null || _ctx$umi === void 0 ? void 0 : _ctx$umi.cwd) || process.cwd(), fileAbsPath));
}
/**
 * rehype plugin for collect slugs & add id for headings
 */
function slug() {
  return (ast, vFile) => {
    // initial slugs
    const slugs = getSluggerIns(this.data('fileAbsPath'), this.data('masterKey'));
    vFile.data.slugs = [];
    (0, _unistUtilVisit().default)(ast, 'element', node => {
      // visit all heading element
      if ((0, _hastUtilIsElement().default)(node, headings)) {
        const title = (0, _hastUtilToString().default)({
          children: filterValidChildren(node.children),
          value: node.value
        });
        // generate id if not exist
        if (!(0, _hastUtilHasProperty().default)(node, 'id')) {
          node.properties.id = slugs.slug(title.trim(), false);
        }
        // save slugs
        vFile.data.slugs.push({
          depth: parseInt(node.tagName[1], 10),
          value: title,
          heading: node.properties.id
        });
        // use first title as page title if not exist
        if (!vFile.data.title) {
          vFile.data.title = title;
        }
      }
    });
  };
}