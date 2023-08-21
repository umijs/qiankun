"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var acorn = require("acorn");
var babel = require("babel-core");
var babel_traverse_1 = require("babel-traverse");
var walk = require("acorn/dist/walk");
require("acorn-dynamic-import/lib/inject").default(acorn);
require("acorn-jsx/inject")(acorn);
require("acorn-object-spread/inject")(acorn);
var ECMA_VERSION = 2017;
var config = {
    presets: [require("babel-preset-env"), require("babel-preset-react")],
    plugins: [
        require("babel-plugin-transform-async-to-generator"),
        require("babel-plugin-transform-object-rest-spread"),
        require("babel-plugin-transform-class-properties"),
        require("babel-plugin-transform-decorators-legacy").default,
        require("babel-plugin-dynamic-import-node").default,
    ],
};
function exportRequires(code) {
    var requires = [];
    try {
        var ast = babel.transform(code, config).ast;
        if (ast) {
            babel_traverse_1.default(ast, {
                enter: function (path) {
                    if (path.node.type === "CallExpression" &&
                        path.node.callee.name === "require" &&
                        path.node.arguments[0]) {
                        if (path.node.arguments[0].type === "StringLiteral") {
                            requires.push(path.node.arguments[0].value);
                        }
                    }
                },
            });
        }
    }
    catch (e) {
        console.error(e);
    }
    return requires;
}
exports.default = exportRequires;
//# sourceMappingURL=extract-requires.js.map