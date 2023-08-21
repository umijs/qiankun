"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const url_1 = require("url");
const koa_module_specifier_transform_1 = require("./koa-module-specifier-transform");
const logger_1 = require("./support/logger");
const path_utils_1 = require("./support/path-utils");
const resolve_node_specifier_1 = require("./support/resolve-node-specifier");
/**
 * @param root The on-disk directory that maps to the served root URL, used to
 *   resolve module specifiers in filesystem.  In most cases this should match
 *   the root directory configured in your downstream static file server
 *   middleware.
 */
exports.nodeResolve = (options = {}) => {
    const logger = options.logger === false ?
        {} :
        logger_1.prefixedLogger('[koa-node-resolve]', options.logger || console);
    return koa_module_specifier_transform_1.moduleSpecifierTransform((baseURL, specifier, logger) => resolve_node_specifier_1.resolveNodeSpecifier(path_utils_1.resolvePathPreserveTrailingSlash(path_1.resolve(options.root || '.'), path_utils_1.noLeadingSlashInURL(url_1.parse(baseURL).pathname || '/')), specifier, logger), Object.assign({}, options, { logger }));
};
//# sourceMappingURL=koa-node-resolve.js.map