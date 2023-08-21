"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
function getFlagsToSet(config) {
    return Object.entries(config)
        .filter(function (entry) {
        var flag = entry[0], value = entry[1];
        if (!value) {
            return false;
        }
        return config_1.ValidPackageFlags.has(flag);
    })
        .map(function (entry) {
        return entry[0];
    });
}
exports.getFlagsToSet = getFlagsToSet;
//# sourceMappingURL=flags.js.map