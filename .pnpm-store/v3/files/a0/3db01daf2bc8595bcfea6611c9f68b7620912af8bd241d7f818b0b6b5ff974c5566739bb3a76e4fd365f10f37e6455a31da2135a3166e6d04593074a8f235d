"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@umijs/utils");
const enhanced_resolve_1 = __importDefault(require("enhanced-resolve"));
const vm_1 = __importDefault(require("vm"));
const utils_2 = require("../../utils");
exports.default = (api) => {
    const sandbox = vm_1.default.createContext({ require });
    let resolver;
    api.describe({
        // disable temporarily
        // ref: https://github.com/umijs/father/issues/624
        enableBy: () => false,
    });
    api.addImportsCheckup(({ file, imports, configProviders, mergedExternals, mergedAlias }) => {
        const errors = [];
        // apply this rule only when cjs available
        if (api.config.cjs) {
            // skip if file is ignored by cjs bundless
            if (configProviders.bundless.cjs.getConfigForFile(file)) {
                imports.forEach((i) => {
                    const pkgName = (0, utils_2.getPkgNameFromPath)(i.path);
                    // ignore relative import and externalized dep
                    if (pkgName &&
                        !mergedExternals[i.path] &&
                        i.kind === 'import-statement') {
                        resolver !== null && resolver !== void 0 ? resolver : (resolver = enhanced_resolve_1.default.create.sync({
                            alias: mergedAlias,
                        }));
                        try {
                            const res = resolver(i.resolveDir, i.path);
                            // only check npm package
                            // why check node_modules?
                            // because some alias may point to src but also like package name
                            if (res && res.includes('node_modules')) {
                                vm_1.default.runInContext(`require('${(0, utils_1.winPath)(res)}')`, sandbox);
                            }
                        }
                        catch (e) {
                            if (e.code === 'ERR_REQUIRE_ESM') {
                                errors.push({
                                    type: 'error',
                                    problem: `CommonJS dist file import an ES Module \`${i.path}\`, it will cause \`ERR_REQUIRE_ESM\` error in Node.js runtime
                  ${utils_1.chalk.gray(`at ${file}`)}`,
                                    solution: 'Convert `import` to `await import`, or find a CommonJS version of the package',
                                });
                            }
                        }
                    }
                });
            }
        }
        return errors;
    });
};
