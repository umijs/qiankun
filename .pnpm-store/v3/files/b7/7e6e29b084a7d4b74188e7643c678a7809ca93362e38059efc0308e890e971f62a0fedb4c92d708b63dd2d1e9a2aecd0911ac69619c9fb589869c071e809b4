"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateExports = generateExports;
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

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const reserveLibrarys = ['umi']; // reserve library

const reserveExportsNames = ['Link', 'NavLink', 'Redirect', 'dynamic', 'router', 'withRouter', 'Route'];

function generateExports({
  item,
  umiExportsHook
}) {
  (0, _assert().default)(item.source, 'source should be supplied.');
  (0, _assert().default)(item.exportAll || item.specifiers, 'exportAll or specifiers should be supplied.');
  (0, _assert().default)(!reserveLibrarys.includes(item.source), `${item.source} is reserve library, Please don't use it.`);

  if (item.exportAll) {
    return `export * from '${(0, _utils().winPath)(item.source)}';`;
  }

  (0, _assert().default)(Array.isArray(item.specifiers), `specifiers should be Array, but got ${item.specifiers.toString()}.`);
  const specifiersStrArr = item.specifiers.map(specifier => {
    if (typeof specifier === 'string') {
      (0, _assert().default)(!reserveExportsNames.includes(specifier), `${specifier} is reserve name, you can use 'exported' to set alias.`);
      (0, _assert().default)(!umiExportsHook[specifier], `${specifier} is Defined, you can use 'exported' to set alias.`);
      umiExportsHook[specifier] = true;
      return specifier;
    } else {
      (0, _assert().default)(_utils().lodash.isPlainObject(specifier), `Configure item context should be Plain Object, but got ${specifier}.`);
      (0, _assert().default)(specifier.local && specifier.exported, 'local and exported should be supplied.');
      return `${specifier.local} as ${specifier.exported}`;
    }
  });
  return `export { ${specifiersStrArr.join(', ')} } from '${(0, _utils().winPath)(item.source)}';`;
}

function _default(api) {
  api.onGenerateFiles( /*#__PURE__*/_asyncToGenerator(function* () {
    const umiExports = yield api.applyPlugins({
      key: 'addUmiExports',
      type: api.ApplyPluginsType.add,
      initialValue: []
    });
    let umiExportsHook = {}; // repeated definition

    api.writeTmpFile({
      path: 'core/umiExports.ts',
      content: umiExports.map(item => {
        return generateExports({
          item,
          umiExportsHook
        });
      }).join('\n') + `\n`
    });
  }));
}