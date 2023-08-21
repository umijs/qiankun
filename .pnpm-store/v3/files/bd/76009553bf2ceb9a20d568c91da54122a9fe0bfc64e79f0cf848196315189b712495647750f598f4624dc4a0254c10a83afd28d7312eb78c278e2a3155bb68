"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ESLintUtils = __importStar(require("./eslint-utils"));
exports.ESLintUtils = ESLintUtils;
const TSESLint = __importStar(require("./ts-eslint"));
exports.TSESLint = TSESLint;
const TSESLintScope = __importStar(require("./ts-eslint-scope"));
exports.TSESLintScope = TSESLintScope;
// for convenience's sake - export the types directly from here so consumers
// don't need to reference/install both packages in their code
// NOTE - this uses hard links inside ts-estree to avoid initing the entire package
//        via its main file (which imports typescript at runtime).
//        Not every eslint-plugin written in typescript requires typescript at runtime.
var ts_estree_1 = require("@typescript-eslint/typescript-estree/dist/ts-estree");
exports.AST_NODE_TYPES = ts_estree_1.AST_NODE_TYPES;
exports.AST_TOKEN_TYPES = ts_estree_1.AST_TOKEN_TYPES;
exports.TSESTree = ts_estree_1.TSESTree;
//# sourceMappingURL=index.js.map