import { __rest, __assign } from 'tslib';
import { addDefault, addNamed } from '@babel/helper-module-imports';
import traverse from '@babel/traverse';
import { createMacro } from 'babel-plugin-macros';
import babelPlugin from 'babel-plugin-styled-components';

function styledComponentsMacro(_a) {
    var references = _a.references, state = _a.state, t = _a.babel.types, _b = _a.config, _c = _b === void 0 ? {} : _b, _d = _c.importModuleName, importModuleName = _d === void 0 ? 'styled-components' : _d, config = __rest(_c, ["importModuleName"]);
    var program = state.file.path;
    // FIRST STEP : replace `styled-components/macro` by `styled-components
    // references looks like this
    // { default: [path, path], css: [path], ... }
    var customImportName;
    Object.keys(references).forEach(function (refName) {
        // generate new identifier
        var id;
        if (refName === 'default') {
            id = addDefault(program, importModuleName, { nameHint: 'styled' });
            customImportName = id;
        }
        else {
            id = addNamed(program, refName, importModuleName, { nameHint: refName });
        }
        // update references with the new identifiers
        references[refName].forEach(function (referencePath) {
            referencePath.node.name = id.name;
        });
    });
    // SECOND STEP : apply babel-plugin-styled-components to the file
    var stateWithOpts = __assign(__assign({}, state), { opts: __assign(__assign({}, config), { topLevelImportPaths: (config.topLevelImportPaths || []).concat(importModuleName) }), customImportName: customImportName });
    traverse(program.parent, babelPlugin({ types: t }).visitor, undefined, stateWithOpts);
}
var index = createMacro(styledComponentsMacro, {
    configName: 'styledComponents',
});

export { index as default };
//# sourceMappingURL=styled-components-macro.esm.js.map
