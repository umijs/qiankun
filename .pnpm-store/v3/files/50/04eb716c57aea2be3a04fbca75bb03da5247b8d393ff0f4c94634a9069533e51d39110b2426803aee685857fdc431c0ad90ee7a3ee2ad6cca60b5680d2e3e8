"use strict";
const path = require("path");
const fs = require("fs-extra");
const ts2js_1 = require("./ts2js");
const eslintJs_1 = require("./eslintJs");
const prettierJs_1 = require("./prettierJs");
function parse(fileList, option = {}) {
    // Get js from ts
    const jsFiles = ts2js_1.default(fileList, option);
    // eslint
    const lintFiles = eslintJs_1.default(jsFiles);
    // prettier
    const prettierFiles = prettierJs_1.default(lintFiles);
    return prettierFiles;
}
function sylvanas(files, option) {
    const cwd = option.cwd || process.cwd();
    const outDir = option.outDir || cwd;
    const action = option.action || 'none';
    const fileList = files.map((file) => {
        const filePath = path.resolve(cwd, file);
        const targetFilePath = path.resolve(outDir, file.replace(/\.ts$/, '.js').replace(/\.tsx$/, '.jsx'));
        return {
            sourceFilePath: filePath,
            targetFilePath,
            data: fs.readFileSync(filePath, 'utf8'),
        };
    });
    const parsedFileList = parse(fileList, option);
    if (action === 'write' || action === 'overwrite') {
        parsedFileList.forEach(({ sourceFilePath, targetFilePath, data }) => {
            fs.ensureFileSync(targetFilePath);
            fs.writeFileSync(targetFilePath, data);
            if (action === 'overwrite') {
                fs.unlinkSync(sourceFilePath);
            }
        });
    }
    return parsedFileList;
}
sylvanas.parseText = function parseText(text, option = {}) {
    const result = parse([
        {
            sourceFilePath: '',
            data: text,
        },
    ], option);
    return result[0].data;
};
module.exports = sylvanas;
