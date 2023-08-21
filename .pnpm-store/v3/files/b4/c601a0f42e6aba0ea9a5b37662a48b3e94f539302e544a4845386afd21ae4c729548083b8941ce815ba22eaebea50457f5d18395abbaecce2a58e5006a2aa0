"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseAdaptor = void 0;
var liteAdaptor_js_1 = require("./liteAdaptor.js");
var browserAdaptor_js_1 = require("./browserAdaptor.js");
var choose;
try {
    document;
    choose = browserAdaptor_js_1.browserAdaptor;
}
catch (e) {
    choose = liteAdaptor_js_1.liteAdaptor;
}
exports.chooseAdaptor = choose;
//# sourceMappingURL=chooseAdaptor.js.map