'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var helperModuleImports = require('@babel/helper-module-imports');
var traverse = require('@babel/traverse');
var babelPluginMacros = require('babel-plugin-macros');
var babelPlugin = require('babel-plugin-styled-components');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var traverse__default = /*#__PURE__*/_interopDefault(traverse);
var babelPlugin__default = /*#__PURE__*/_interopDefault(babelPlugin);

function styledComponentsMacro(_a) {
    var references = _a.references, state = _a.state, t = _a.babel.types, _b = _a.config, _c = _b === void 0 ? {} : _b, _d = _c.importModuleName, importModuleName = _d === void 0 ? 'styled-components' : _d, config = tslib.__rest(_c, ["importModuleName"]);
    var program = state.file.path;
    // FIRST STEP : replace `styled-components/macro` by `styled-components
    // references looks like this
    // { default: [path, path], css: [path], ... }
    var customImportName;
    Object.keys(references).forEach(function (refName) {
        // generate new identifier
        var id;
        if (refName === 'default') {
            id = helperModuleImports.addDefault(program, importModuleName, { nameHint: 'styled' });
            customImportName = id;
        }
        else {
            id = helperModuleImports.addNamed(program, refName, importModuleName, { nameHint: refName });
        }
        // update references with the new identifiers
        references[refName].forEach(function (referencePath) {
            referencePath.node.name = id.name;
        });
    });
    // SECOND STEP : apply babel-plugin-styled-components to the file
    var stateWithOpts = tslib.__assign(tslib.__assign({}, state), { opts: tslib.__assign(tslib.__assign({}, config), { topLevelImportPaths: (config.topLevelImportPaths || []).concat(importModuleName) }), customImportName: customImportName });
    traverse__default.default(program.parent, babelPlugin__default.default({ types: t }).visitor, undefined, stateWithOpts);
}
var index = babelPluginMacros.createMacro(styledComponentsMacro, {
    configName: 'styledComponents',
});

exports.default = index;
//# sourceMappingURL=styled-components-macro.cjs.js.map
