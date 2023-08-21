"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.specifiersToProperties = specifiersToProperties;
exports.default = _default;

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

function specifiersToProperties(specifiers) {
  return specifiers.reduce((memo, s) => {
    if (_utils().t.isImportDefaultSpecifier(s)) {
      memo.properties.push(_utils().t.objectProperty(_utils().t.identifier('default'), s.local));
    } else if (_utils().t.isExportDefaultSpecifier(s)) {
      memo.properties.push(_utils().t.objectProperty(_utils().t.identifier('default'), s.exported));
    } else if (_utils().t.isExportSpecifier(s)) {
      if (_utils().t.isIdentifier(s.exported, {
        name: 'default'
      })) {
        memo.defaultIdentifier = s.local.name;
        memo.properties.push(_utils().t.objectProperty(s.local, s.local));
      } else {
        memo.properties.push(_utils().t.objectProperty(s.local, s.exported));
      }
    } else if (_utils().t.isImportNamespaceSpecifier(s)) {
      memo.namespaceIdentifier = s.local;
    } else {
      memo.properties.push(_utils().t.objectProperty(s.imported, s.local));
    }

    return memo;
  }, {
    properties: [],
    namespaceIdentifier: null,
    defaultIdentifier: null
  });
}

const RE_NODE_MODULES = /node_modules/;
const RE_UMI_LOCAL_DEV = /umi\/packages\//;

function getAlias(opts) {
  for (var _i = 0, _Object$keys = Object.keys(opts.webpackAlias); _i < _Object$keys.length; _i++) {
    const key = _Object$keys[_i];
    const value = opts.webpackAlias[key]; // exact alias
    // ref: https://webpack.js.org/configuration/resolve/#resolvealias

    if (key.endsWith('$')) {
      if (opts.path === key.slice(0, -1)) return value;
      continue;
    }

    if (opts.path === key) {
      return value;
    }

    const path = isJSFile(opts.webpackAlias[key]) ? key : addLastSlash(key);

    if (opts.path.startsWith(path)) {
      return value;
    }
  }

  return null;
}

function isJSFile(path) {
  return ['.js', '.jsx', '.ts', '.tsx'].includes((0, _path().extname)(path));
}

function addLastSlash(path) {
  return path.endsWith('/') ? path : `${path}/`;
}

function makeArray(item) {
  return Array.isArray(item) ? item : [item];
}

function isExternals(opts) {
  const webpackExternals = makeArray(opts.webpackExternals);
  const path = opts.path;

  if (webpackExternals.some(webpackExternal => isExternal({
    webpackExternal,
    path
  }))) {
    return true;
  }

  return false;
}

function isExternal(opts) {
  if (typeof opts.webpackExternal === 'object') {
    return !!opts.webpackExternal[opts.path];
  } else if (typeof opts.webpackExternal === 'function') {
    let ret = false;
    opts.webpackExternal({}, opts.path, (_, b) => {
      ret = !!b;
    });
    return ret;
  } else {
    return false;
  }
}

function isMatchLib(path, libs, matchAll, remoteName, alias, webpackAlias, webpackExternals) {
  if (matchAll) {
    if (path === 'umi' || path === 'dumi' || path === '@alipay/bigfish') return false;
    if (path.startsWith(`${remoteName}/`)) return false; // don't match dynamic path
    // e.g. @umijs/deps/compiled/babel/svgr-webpack.js?-svgo,+titleProp,+ref!./umi.svg

    if ((0, _utils().winPath)(path).includes('babel/svgr-webpack')) return false; // don't match webpack loader
    // e.g. !!dumi-raw-code-loader!/path/to/VerticalProgress/index.module.less?dumi-raw-code

    if (path.startsWith('!!')) return false;

    if (isExternals({
      webpackExternals,
      path
    })) {
      return false;
    }

    if ((0, _path().isAbsolute)(path)) {
      return RE_NODE_MODULES.test(path) || RE_UMI_LOCAL_DEV.test(path);
    } else if (path.charAt(0) === '.') {
      return false;
    } else {
      const aliasPath = getAlias({
        path,
        webpackAlias
      });

      if (aliasPath) {
        return RE_NODE_MODULES.test(aliasPath) || RE_UMI_LOCAL_DEV.test(aliasPath);
      }

      return true;
    }
  }

  return (libs || []).concat(Object.keys(alias)).some(lib => {
    if (typeof lib === 'string') {
      return lib === path;
    } else if (lib instanceof RegExp) {
      return lib.test(path);
    } else {
      throw new Error('Unsupported lib format.');
    }
  });
}

function getPath(path, alias) {
  const keys = Object.keys(alias);

  for (var _i2 = 0, _keys = keys; _i2 < _keys.length; _i2++) {
    const key = _keys[_i2];

    if (path.startsWith(key)) {
      return path.replace(key, alias[key]);
    }
  }

  return path;
}

function _default() {
  return {
    visitor: {
      Program: {
        exit(path, {
          opts
        }) {
          const variableDeclarations = [];
          const exportDefaultDeclarations = [];
          let index = path.node.body.length - 1;

          while (index >= 0) {
            const d = path.node.body[index];

            if (_utils().t.isImportDeclaration(d)) {
              var _opts$onTransformDeps;

              const isMatch = isMatchLib(d.source.value, opts.libs, opts.matchAll, opts.remoteName, opts.alias || {}, opts.webpackAlias || {}, opts.webpackExternals || {});
              (_opts$onTransformDeps = opts.onTransformDeps) === null || _opts$onTransformDeps === void 0 ? void 0 : _opts$onTransformDeps.call(opts, {
                source: d.source.value,
                // @ts-ignore
                file: path.hub.file.opts.filename,
                isMatch
              });

              if (isMatch || // css 走异步加载，修复 mfsu 场景下样式覆盖顺序的问题
              /\.(css|less|sass|scss|stylus|styl)(\?.+?)?$/.test(d.source.value)) {
                const _specifiersToProperti = specifiersToProperties(d.specifiers),
                      properties = _specifiersToProperti.properties,
                      namespaceIdentifier = _specifiersToProperti.namespaceIdentifier;

                const id = _utils().t.objectPattern(properties);

                const init = _utils().t.awaitExpression(_utils().t.callExpression(_utils().t.import(), [_utils().t.stringLiteral(isMatch ? `${opts.remoteName}/${getPath(d.source.value, opts.alias || {})}` : d.source.value)]));

                if (namespaceIdentifier) {
                  if (properties.length) {
                    variableDeclarations.unshift(_utils().t.variableDeclaration('const', [_utils().t.variableDeclarator(id, namespaceIdentifier)]));
                  }

                  variableDeclarations.unshift(_utils().t.variableDeclaration('const', [_utils().t.variableDeclarator(namespaceIdentifier, init)]));
                } else {
                  variableDeclarations.unshift(_utils().t.variableDeclaration('const', [_utils().t.variableDeclarator(id, init)]));
                }

                path.node.body.splice(index, 1);
              }
            } // export * from 'foo';


            if (_utils().t.isExportAllDeclaration(d) && d.source) {
              var _opts$onTransformDeps2, _opts$exportAllMember, _opts$exportAllMember2, _opts$exportAllMember3;

              const isMatch = isMatchLib(d.source.value, opts.libs, opts.matchAll, opts.remoteName, opts.alias || {}, opts.webpackAlias || {}, opts.webpackExternals || {});
              (_opts$onTransformDeps2 = opts.onTransformDeps) === null || _opts$onTransformDeps2 === void 0 ? void 0 : _opts$onTransformDeps2.call(opts, {
                source: d.source.value,
                // @ts-ignore
                file: path.hub.file.opts.filename,
                isMatch: isMatch && ((_opts$exportAllMember = opts.exportAllMembers) === null || _opts$exportAllMember === void 0 ? void 0 : (_opts$exportAllMember2 = _opts$exportAllMember[d.source.value]) === null || _opts$exportAllMember2 === void 0 ? void 0 : _opts$exportAllMember2.length),
                isExportAllDeclaration: true
              });

              const exportAllIdentifier = _utils().t.identifier(`__all_exports_${d.source.value.replace(/(@|\/|-)/g, '_')}`);

              if (isMatch && ((_opts$exportAllMember3 = opts.exportAllMembers) === null || _opts$exportAllMember3 === void 0 ? void 0 : _opts$exportAllMember3[d.source.value])) {
                if (opts.exportAllMembers[d.source.value].length) {
                  const id = exportAllIdentifier;

                  const init = _utils().t.awaitExpression(_utils().t.callExpression(_utils().t.import(), [_utils().t.stringLiteral(`${opts.remoteName}/${getPath(d.source.value, opts.alias || {})}`)]));

                  variableDeclarations.unshift(_utils().t.variableDeclaration('const', [_utils().t.variableDeclarator(id, init)])); // replace node with export const { a, b, c } = __all_exports
                  // a, b, c was declared from opts.exportAllMembers

                  path.node.body[index] = _utils().t.exportNamedDeclaration(_utils().t.variableDeclaration('const', [_utils().t.variableDeclarator(_utils().t.objectPattern(opts.exportAllMembers[d.source.value].map(m => _utils().t.objectProperty(_utils().t.identifier(m), _utils().t.identifier(m)))), exportAllIdentifier)]));
                } // 有些 export * 只是为了类型
                else {
                    path.node.body[index] = _utils().t.expressionStatement(_utils().t.numericLiteral(1));
                  }
              }
            } // export { bar } from 'foo';


            if (_utils().t.isExportNamedDeclaration(d) && d.source) {
              var _opts$onTransformDeps3;

              const isMatch = isMatchLib(d.source.value, opts.libs, opts.matchAll, opts.remoteName, opts.alias || {}, opts.webpackAlias || {}, opts.webpackExternals || {});
              (_opts$onTransformDeps3 = opts.onTransformDeps) === null || _opts$onTransformDeps3 === void 0 ? void 0 : _opts$onTransformDeps3.call(opts, {
                source: d.source.value,
                // @ts-ignore
                file: path.hub.file.opts.filename,
                isMatch
              });

              if (isMatch) {
                const _specifiersToProperti2 = specifiersToProperties(d.specifiers),
                      properties = _specifiersToProperti2.properties,
                      defaultIdentifier = _specifiersToProperti2.defaultIdentifier;

                const id = _utils().t.objectPattern(properties);

                const init = _utils().t.awaitExpression(_utils().t.callExpression(_utils().t.import(), [_utils().t.stringLiteral(`${opts.remoteName}/${getPath(d.source.value, opts.alias || {})}`)]));

                variableDeclarations.unshift(_utils().t.variableDeclaration('const', [_utils().t.variableDeclarator(id, init)]));
                d.source = null;
                d.specifiers = d.specifiers.filter(node => {
                  return !(_utils().t.isExportSpecifier(node) && _utils().t.isIdentifier(node.exported) && node.exported.name === 'default');
                });

                if (d.specifiers.length) {
                  d.specifiers.forEach(node => {
                    if (_utils().t.isExportSpecifier(node) && _utils().t.isIdentifier(node.local) && _utils().t.isIdentifier(node.exported)) {
                      node.local = node.exported;
                    }
                  });
                } else {
                  path.node.body.splice(index, 1);
                }

                if (defaultIdentifier) {
                  exportDefaultDeclarations.push(_utils().t.exportDefaultDeclaration(_utils().t.identifier(defaultIdentifier)));
                }
              }
            }

            index -= 1;
          }

          path.node.body = [...variableDeclarations, ...path.node.body, ...exportDefaultDeclarations];
        }

      },

      CallExpression(path, {
        opts
      }) {
        const node = path.node;

        if (_utils().t.isImport(node.callee) && node.arguments.length === 1 && node.arguments[0].type === 'StringLiteral') {
          var _opts$onTransformDeps4;

          const value = node.arguments[0].value;
          const isMatch = isMatchLib(value, opts.libs, opts.matchAll, opts.remoteName, opts.alias || {}, opts.webpackAlias || {}, opts.webpackExternals || {});
          (_opts$onTransformDeps4 = opts.onTransformDeps) === null || _opts$onTransformDeps4 === void 0 ? void 0 : _opts$onTransformDeps4.call(opts, {
            source: value,
            // @ts-ignore
            file: path.hub.file.opts.filename,
            isMatch
          });

          if (isMatch) {
            node.arguments[0] = _utils().t.stringLiteral(`${opts.remoteName}/${getPath(value, opts.alias || {})}`);
          }
        }
      }

    }
  };
}