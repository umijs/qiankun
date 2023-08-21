"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return {
    visitor: {
      ImportDeclaration: {
        exit(path, {
          opts: redirect
        }) {
          const _path$node = path.node,
                specifiers = _path$node.specifiers,
                source = _path$node.source;
          const value = source.value;

          if (!Object.keys(redirect).includes(value)) {
            return;
          }

          const rMap = redirect[value];
          const imports = specifiers.map(spec => {
            if (_utils().t.isImportSpecifier(spec)) {
              return spec.imported.name;
            }
          }).filter(Boolean);

          if (!_utils().lodash.intersection(imports, Object.keys(redirect[value])).length) {
            return;
          }

          specifiers.forEach(spec => {
            if (_utils().t.isImportSpecifier(spec)) {
              const importedName = spec.imported.name,
                    localName = spec.local.name;
              if (!rMap[importedName]) return;

              const importDeclaration = _utils().t.importDeclaration([_utils().t.importSpecifier(_utils().t.identifier(localName), _utils().t.identifier(importedName))], _utils().t.stringLiteral(rMap[importedName]));

              path.insertAfter([importDeclaration]);
            }
          });
          const restImport = specifiers.filter(spec => {
            if (_utils().t.isImportDefaultSpecifier(spec)) {
              return true;
            }

            if (_utils().t.isImportSpecifier(spec)) {
              if (rMap[spec.imported.name]) {
                return false;
              }
            }

            return true;
          });

          if (restImport.length) {
            path.replaceWith(_utils().t.importDeclaration(restImport, _utils().t.stringLiteral(value)));
          } else {
            path.remove();
          }
        }

      }
    }
  };
}