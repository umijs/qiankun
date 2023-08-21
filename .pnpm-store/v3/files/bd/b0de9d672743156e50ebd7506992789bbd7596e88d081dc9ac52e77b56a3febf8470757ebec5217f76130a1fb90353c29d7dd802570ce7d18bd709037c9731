"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidResource(resource) {
    return (resource.startsWith("https://") ||
        resource.startsWith("http://") ||
        resource.startsWith("//"));
}
/**
 * Checks line for css resource, returns if exist
 *
 * @param {string} line  line to check
 * @returns {(string | undefined)}
 */
function getCssResource(line) {
    var cssRegex = /<link[^]*href="(.*\.css)"/;
    var match = line.match(cssRegex);
    if (match && match[1]) {
        var resource = match[1];
        if (!isValidResource(resource)) {
            return;
        }
        return resource;
    }
}
/**
 * Checks line for js resource, returns if resource exist
 *
 * @param {string} line  line to check
 * @returns {(string | undefined)}
 */
function getJsResource(line) {
    var jsRegex = /<script[^]*src="(.*)"/;
    var match = line.match(jsRegex);
    if (match && match[1]) {
        var resource = match[1];
        if (!isValidResource(resource)) {
            return;
        }
        return resource;
    }
}
/**
 * Returns an array of strings to external resources, we deliberately don't check
 * for javascript, since this is often added to the body. The body will be copied over
 *
 * @param {string} html
 */
function getExternalResources(html) {
    return html
        .split("\n")
        .map(function (line) { return getCssResource(line) || getJsResource(line); })
        .filter(function (x) { return x; });
}
/**
 * Get all information in the body
 *
 * @param {string} html
 */
function getBodyContent(html) {
    var bodyRegex = /<body>([^]*)<\/body>/;
    var match = html.match(bodyRegex);
    if (match) {
        return match[1];
    }
}
/**
 * Parses the html for external resources and body
 *
 * @export
 * @param {string} html
 */
function parseHTML(html) {
    var externalResources = getExternalResources(html);
    var bodyContent = getBodyContent(html);
    return {
        body: bodyContent || '<div id="root"></div>',
        externalResources: externalResources,
    };
}
exports.default = parseHTML;
//# sourceMappingURL=html-parser.js.map