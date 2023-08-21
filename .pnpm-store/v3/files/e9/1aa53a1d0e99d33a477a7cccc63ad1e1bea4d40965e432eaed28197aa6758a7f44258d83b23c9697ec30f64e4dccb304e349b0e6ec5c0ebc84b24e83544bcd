"use strict";
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
const path_1 = require("path");
const filenameRegex = process.platform === 'win32' ? /[^\\]+$/ : /[^\/]+$/;
/**
 * Similar to `path.dirname()` except includes trailing slash and for a
 * path `/like/this/` will return `/like/this/` instead of `/like` since the
 * trailing slash indicates `this` is a folder name not a file name.
 * (`path.dirname('/like/this/')` returns `/like`.)
 */
exports.dirname = (path) => path.replace(filenameRegex, '');
exports.ensureLeadingDotInURL = (path) => (path.startsWith('../') || path.startsWith('./')) ? path : './' + path;
exports.ensureTrailingSlashInPath = (path) => path.endsWith(path_1.sep) ? path : path + path_1.sep;
exports.forwardSlashesOnlyPlease = (path) => path.replace(/\\/g, '/');
exports.getBaseURL = (href) => href.replace(/[^\/]+$/, '');
exports.noTrailingSlashInPath = (path) => path.replace(/\/$/, '');
exports.noLeadingSlashInURL = (href) => href.replace(/^\//, '');
exports.relativePathToURL = (from, to) => exports.ensureLeadingDotInURL(path_1.posix.relative(exports.getBaseURL(exports.forwardSlashesOnlyPlease(from)), exports.forwardSlashesOnlyPlease(to)));
exports.resolvePathPreserveTrailingSlash = (from, to) => {
    const resolvedPath = path_1.resolve(from, to);
    return isDirectorySpecifier(to) ? `${resolvedPath}/` : resolvedPath;
};
const isDirectorySpecifier = (specifier) => ['', '.', '..'].includes(specifier.match(/([^\/]*$)/)[0]);
//# sourceMappingURL=path-utils.js.map