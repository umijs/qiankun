"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const parse5_utils_1 = require("./support/parse5-utils");
const string_utils_1 = require("./support/string-utils");
const transform_js_module_1 = require("./transform-js-module");
exports.transformHTML = (ast, url, specifierTransform, jsModuleTransform, logger) => {
    const baseURL = getBaseURL(ast, url);
    getInlineModuleScripts(ast).forEach((scriptTag) => {
        const originalJS = parse5_utils_1.getTextContent(scriptTag);
        const transformedJS = string_utils_1.preserveSurroundingWhitespace(originalJS, jsModuleTransform(originalJS, (ast) => transform_js_module_1.transformJSModule(ast, baseURL, specifierTransform, logger)));
        parse5_utils_1.setTextContent(scriptTag, transformedJS);
    });
    return ast;
};
const getBaseURL = (ast, location) => {
    const baseTag = getBaseTag(ast);
    if (!baseTag) {
        return location;
    }
    const baseHref = parse5_utils_1.getAttr(baseTag, 'href');
    if (!baseHref) {
        return location;
    }
    return url_1.resolve(location, baseHref);
};
const getBaseTag = (ast) => getTags(ast, 'base').shift();
const getInlineModuleScripts = (ast) => getTags(ast, 'script')
    .filter((node) => parse5_utils_1.getAttr(node, 'type') === 'module' && !parse5_utils_1.getAttr(node, 'src'));
const getTags = (ast, name) => parse5_utils_1.nodeWalkAll(ast, (node) => node.nodeName === name);
//# sourceMappingURL=transform-html.js.map