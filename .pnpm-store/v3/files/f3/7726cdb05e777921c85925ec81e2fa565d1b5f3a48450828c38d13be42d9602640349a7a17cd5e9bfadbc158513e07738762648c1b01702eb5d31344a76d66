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
const resolve_1 = __importDefault(require("resolve"));
const path_utils_1 = require("./path-utils");
exports.resolveNodeSpecifier = (modulePath, specifier, logger) => {
    if (isURL(specifier)) {
        return specifier;
    }
    try {
        const dependencyPath = resolve_1.default.sync(specifier, {
            basedir: path_utils_1.dirname(modulePath),
            extensions: ['.js', '.json', '.node'],
            packageFilter: (packageJson) => Object.assign(packageJson, {
                main: packageJson.module || packageJson['jsnext:main'] ||
                    packageJson.main
            })
        });
        const resolvedURL = path_utils_1.relativePathToURL(modulePath, dependencyPath);
        if (resolvedURL !== specifier) {
            logger.debug &&
                logger.debug(`Resolved Node module specifier "${specifier}" to "${resolvedURL}"`);
        }
        return resolvedURL;
    }
    catch (error) {
        logger.warn &&
            logger.warn(`Unable to resolve Node module specifier "${specifier}" due to`, error);
        return specifier;
    }
};
const isURL = (value) => {
    try {
        new URL(value);
        return true;
    }
    catch (error) {
        return false;
    }
};
//# sourceMappingURL=resolve-node-specifier.js.map