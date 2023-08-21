"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncLoad = void 0;
var mathjax_js_1 = require("../mathjax.js");
function asyncLoad(name) {
    if (!mathjax_js_1.mathjax.asyncLoad) {
        return Promise.reject("Can't load '".concat(name, "': No asyncLoad method specified"));
    }
    return new Promise(function (ok, fail) {
        var result = mathjax_js_1.mathjax.asyncLoad(name);
        if (result instanceof Promise) {
            result.then(function (value) { return ok(value); }).catch(function (err) { return fail(err); });
        }
        else {
            ok(result);
        }
    });
}
exports.asyncLoad = asyncLoad;
//# sourceMappingURL=AsyncLoad.js.map