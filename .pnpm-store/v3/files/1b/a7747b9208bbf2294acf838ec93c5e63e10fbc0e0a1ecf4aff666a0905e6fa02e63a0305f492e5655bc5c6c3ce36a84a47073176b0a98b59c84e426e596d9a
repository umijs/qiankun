"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const traverse_1 = __importDefault(require("@babel/traverse"));
const types_1 = require("@babel/types");
exports.transformJSModule = (ast, url, specifierTransform, logger) => {
    const importExportDeclaration = {
        enter(path) {
            if (path.node && path.node.source &&
                types_1.isStringLiteral(path.node.source)) {
                const specifier = path.node.source.value;
                const transformedSpecifier = specifierTransform(url, specifier, logger);
                if (typeof transformedSpecifier === 'undefined') {
                    return;
                }
                path.node.source.value = transformedSpecifier;
            }
        }
    };
    traverse_1.default(ast, {
        ImportDeclaration: importExportDeclaration,
        ExportAllDeclaration: importExportDeclaration,
        ExportNamedDeclaration: importExportDeclaration,
        CallExpression: {
            enter(path) {
                if (path.node && path.node.callee && types_1.isImport(path.node.callee) &&
                    path.node.arguments.length === 1 &&
                    types_1.isStringLiteral(path.node.arguments[0])) {
                    const argument = path.node.arguments[0];
                    const specifier = argument.value;
                    const transformedSpecifier = specifierTransform(url, specifier, logger);
                    if (typeof transformedSpecifier === 'undefined') {
                        return;
                    }
                    argument.value = transformedSpecifier;
                }
            }
        }
    });
    return ast;
};
//# sourceMappingURL=transform-js-module.js.map