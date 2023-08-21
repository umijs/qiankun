"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babel/core");
const babel_decorator_plugin_1 = require("./babel-decorator-plugin");
function ts2js(fileList, option = {}) {
    const jsFiles = fileList.map((entity) => {
        const { code } = core_1.transformSync(entity.data, {
            plugins: [
                [
                    babel_decorator_plugin_1.default,
                    {
                        decoratorsBeforeExport: !!option.decoratorsBeforeExport,
                    },
                ],
                [require.resolve('@babel/plugin-syntax-dynamic-import')],
                [
                    require.resolve('@babel/plugin-transform-typescript'),
                    {
                        isTSX: true,
                    },
                ],
            ],
        });
        return {
            ...entity,
            data: code,
        };
    });
    return jsFiles;
}
exports.default = ts2js;
