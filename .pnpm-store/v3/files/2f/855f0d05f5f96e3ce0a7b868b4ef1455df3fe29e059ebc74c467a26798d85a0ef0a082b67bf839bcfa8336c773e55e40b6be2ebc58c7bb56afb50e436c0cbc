"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mathjax = void 0;
var version_js_1 = require("./components/version.js");
var HandlerList_js_1 = require("./core/HandlerList.js");
var Retries_js_1 = require("./util/Retries.js");
exports.mathjax = {
    version: version_js_1.VERSION,
    handlers: new HandlerList_js_1.HandlerList(),
    document: function (document, options) {
        return exports.mathjax.handlers.document(document, options);
    },
    handleRetriesFor: Retries_js_1.handleRetriesFor,
    retryAfter: Retries_js_1.retryAfter,
    asyncLoad: null,
};
//# sourceMappingURL=mathjax.js.map