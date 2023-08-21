"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBaseURL = void 0;
var mathjax_js_1 = require("../../mathjax.js");
var root = 'file://' + __dirname.replace(/\/\/[^\/]*$/, '/');
if (!mathjax_js_1.mathjax.asyncLoad && typeof System !== 'undefined' && System.import) {
    mathjax_js_1.mathjax.asyncLoad = function (name) {
        return System.import(name, root);
    };
}
function setBaseURL(URL) {
    root = URL;
    if (!root.match(/\/$/)) {
        root += '/';
    }
}
exports.setBaseURL = setBaseURL;
//# sourceMappingURL=system.js.map