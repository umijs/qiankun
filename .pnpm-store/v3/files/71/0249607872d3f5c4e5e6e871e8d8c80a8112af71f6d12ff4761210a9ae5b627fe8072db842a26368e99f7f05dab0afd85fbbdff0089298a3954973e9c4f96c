"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const generator_1 = __importDefault(require("@babel/generator"));
const parser_1 = require("@babel/parser");
const get_stream_1 = __importDefault(require("get-stream"));
const parse5_1 = require("parse5");
const logger_1 = require("./support/logger");
const parse5_utils_1 = require("./support/parse5-utils");
const string_utils_1 = require("./support/string-utils");
const transform_html_1 = require("./transform-html");
const transform_js_module_1 = require("./transform-js-module");
const defaultHTMLParser = (html) => parse5_1.parse(html, { sourceCodeLocationInfo: true });
const defaultHTMLSerializer = (ast) => {
    parse5_utils_1.removeFakeRootElements(ast);
    return parse5_1.serialize(ast);
};
const defaultJSParser = (js) => parser_1.parse(js, {
    sourceType: 'unambiguous',
    allowAwaitOutsideFunction: true,
    plugins: [
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'importMeta',
    ],
});
const defaultJSSerializer = (ast) => generator_1.default(ast, {
    concise: false,
    jsescOption: {
        quotes: 'single',
    },
    retainFunctionParens: true,
    retainLines: true,
}).code;
exports.moduleSpecifierTransform = (specifierTransform, options = {}) => {
    const logLevel = options.logLevel || 'warn';
    const logger = options.logger === false ?
        {} :
        logger_1.leveledLogger(options.logger || console, logLevel);
    const htmlParser = options.htmlParser || defaultHTMLParser;
    const htmlSerializer = options.htmlSerializer || defaultHTMLSerializer;
    const jsParser = options.jsParser || defaultJSParser;
    const jsSerializer = options.jsSerializer || defaultJSSerializer;
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        yield next();
        // When the response is not HTML or JavaScript, we have nothing to
        // transform.
        if (!(ctx.response.is('html') || ctx.response.is('js'))) {
            return;
        }
        const body = yield getBodyAsString(ctx.body);
        // When there's no body to return, there's nothing to transform.
        if (!body) {
            return;
        }
        const url = ctx.request.url;
        const htmlSourceStrategy = (html, transform) => htmlSerializer(transform(htmlParser(html)));
        const jsSourceStrategy = (js, transform) => jsSerializer(transform(jsParser(js)));
        let specifierTransformCount = 0;
        const countedSpecifierTransform = (baseURL, specifier, logger) => {
            const result = specifierTransform(baseURL, specifier, logger);
            if (result && result !== specifier) {
                ++specifierTransformCount;
            }
            return result;
        };
        try {
            if (ctx.response.is('html')) {
                ctx.body = string_utils_1.preserveSurroundingWhitespace(body, htmlSourceStrategy(body, (ast) => transform_html_1.transformHTML(ast, url, countedSpecifierTransform, jsSourceStrategy, logger)));
            }
            else if (ctx.response.is('js')) {
                ctx.body = string_utils_1.preserveSurroundingWhitespace(body, jsSourceStrategy(body, (ast) => transform_js_module_1.transformJSModule(ast, url, countedSpecifierTransform, logger)));
            }
            if (specifierTransformCount > 0) {
                logger.info &&
                    logger.info(`Transformed ${specifierTransformCount} module specifier(s) in "${url}"`);
            }
        }
        catch (error) {
            logger.error &&
                logger.error(`Unable to transform module specifiers in "${url}" due to`, error);
            // We want errors to result in serving the unchanged original file. If
            // body was a stream then we've already consumed it, so we need to
            // assign the string copy here.
            ctx.body = body;
        }
    });
};
// TODO(usergenic): This should probably be published as a separate npm package.
const getBodyAsString = (body) => __awaiter(this, void 0, void 0, function* () {
    if (Buffer.isBuffer(body)) {
        return body.toString();
    }
    if (isStream(body)) {
        return yield get_stream_1.default(body);
    }
    if (typeof body !== 'string') {
        return '';
    }
    return body;
});
const isStream = (value) => value !== null && typeof value === 'object' &&
    typeof value.pipe === 'function';
//# sourceMappingURL=koa-module-specifier-transform.js.map