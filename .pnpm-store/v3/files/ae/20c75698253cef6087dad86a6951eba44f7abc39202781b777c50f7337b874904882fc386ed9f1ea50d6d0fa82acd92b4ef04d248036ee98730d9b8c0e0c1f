"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoErrorsConfiguration = void 0;
var Configuration_js_1 = require("../Configuration.js");
function noErrors(factory, message, _id, expr) {
    var mtext = factory.create('token', 'mtext', {}, expr.replace(/\n/g, ' '));
    var error = factory.create('node', 'merror', [mtext], { 'data-mjx-error': message, title: message });
    return error;
}
exports.NoErrorsConfiguration = Configuration_js_1.Configuration.create('noerrors', { nodes: { 'error': noErrors } });
//# sourceMappingURL=NoErrorsConfiguration.js.map