"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParameters = void 0;
var LZString = require("lz-string");
function compress(input) {
    return LZString.compressToBase64(input)
        .replace(/\+/g, "-") // Convert '+' to '-'
        .replace(/\//g, "_") // Convert '/' to '_'
        .replace(/=+$/, ""); // Remove ending '='
}
function getParameters(parameters) {
    return compress(JSON.stringify(parameters));
}
exports.getParameters = getParameters;
//# sourceMappingURL=define.js.map