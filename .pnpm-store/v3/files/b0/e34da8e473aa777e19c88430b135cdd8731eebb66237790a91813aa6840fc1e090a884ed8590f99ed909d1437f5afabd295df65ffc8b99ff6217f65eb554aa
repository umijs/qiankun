"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.path2Component = void 0;

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

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * convert path into componentName
 * like:
 *  - src/index.tsx => SrcIndex
 *  - components/Header.tsx => ComponentHeader
 *
 * @param filePath
 * @returns {string} componentName
 */
const path2Component = filePath => {
  const _parse = (0, _path().parse)(filePath),
        ext = _parse.ext;

  const filePathWithoutExt = filePath // remove extension
  .replace(ext, '').split(_path().sep) // upperFirst
  .map(item => _utils().lodash.upperFirst(item.replace(/\W/g, ''))).join('');
  return filePathWithoutExt;
}; // @ts-ignore


exports.path2Component = path2Component;

var _default = babel => {
  const t = babel.types;
  return {
    visitor: {
      // @ts-ignore
      ExportDefaultDeclaration: {
        enter(path, state) {
          const def = path.node.declaration;
          const _state$file$opts = state.file.opts,
                cwd = _state$file$opts.cwd,
                filename = _state$file$opts.filename;
          const relativePath = (0, _path().relative)(cwd, filename);

          if (/^\.(tsx|jsx)$/.test((0, _path().extname)(relativePath)) && // hidden relativePath
          !/(^|\/)\.[^\/\.]/g.test(relativePath) && !relativePath.includes('node_modules')) {
            let componentName = path2Component(relativePath);

            if (!componentName) {
              return;
            } // solve identifier conflict


            const identifiers = Object.keys(path.scope.bindings || {}); // add index if conflict

            let idx = 0; // loop util componentName conflict

            while (identifiers.includes(componentName)) {
              componentName = `${componentName}${idx}`;
              idx += 1;
            } // generate component name identifier


            const named = t.identifier(componentName);

            if (t.isArrowFunctionExpression(def)) {
              const varDec = t.variableDeclaration('const', [t.variableDeclarator(named, def)]);

              const _path$insertBefore = path.insertBefore(varDec),
                    _path$insertBefore2 = _slicedToArray(_path$insertBefore, 1),
                    varDeclPath = _path$insertBefore2[0];

              path.scope.registerDeclaration(varDeclPath);
              path.replaceWith(t.exportDefaultDeclaration(named));
            } else if (t.isFunctionDeclaration(def) && !def.id) {
              def.id = named;
            }
          }
        }

      }
    }
  };
};

exports.default = _default;