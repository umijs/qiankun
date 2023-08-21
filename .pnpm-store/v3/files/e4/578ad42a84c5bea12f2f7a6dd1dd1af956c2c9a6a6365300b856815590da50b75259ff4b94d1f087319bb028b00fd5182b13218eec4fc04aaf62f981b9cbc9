"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const eslint_1 = require("eslint");
const importCache = require('import-fresh');
const engine = new eslint_1.CLIEngine({
    useEslintrc: false,
    fix: true,
    baseConfig: importCache(path.resolve(__dirname, '../eslintrc.js')),
});
exports.lintAndFix = content => {
    const report = engine.executeOnText(content);
    if (report.results[0].output) {
        return report.results[0].output;
    }
    return content;
};
function eslintJS(jsFiles) {
    const lintFiles = jsFiles.map((entity) => {
        let output = entity.data;
        try {
            output = exports.lintAndFix(entity.data);
        }
        catch (e) {
            console.error(e);
        }
        return {
            ...entity,
            data: output,
        };
    });
    return lintFiles;
}
exports.default = eslintJS;
