"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const prettier_1 = require("prettier");
function prettierJS(jsFiles) {
    const str = fs.readFileSync(path.resolve(__dirname, '../.prettierrc'), 'utf8');
    const prettierOption = JSON.parse(str);
    prettierOption.parser = 'babel';
    return jsFiles.map(entity => {
        let data = entity.data;
        try {
            data = prettier_1.format(entity.data, prettierOption);
        }
        catch (e) {
            console.error('error', e);
        }
        return {
            ...entity,
            data,
        };
    });
}
exports.default = prettierJS;
