"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
function getPackageList(packages) {
    if (Array.isArray(packages)) {
        return packages.filter(function (pkg) { return typeof pkg === 'string'; });
    }
    var entries = Object.entries(packages);
    return entries
        .filter(function (_a) {
        var name = _a[0], version = _a[1];
        return ((typeof name === 'string' && typeof version === 'string') ||
            typeof version === 'undefined');
    })
        .map(function (_a) {
        var name = _a[0], version = _a[1];
        return version ? name + "@" + version : name;
    });
}
exports.getPackageList = getPackageList;
function getExecaConfig(config) {
    return {
        stdio: config.stdio,
        cwd: config.cwd,
    };
}
exports.getExecaConfig = getExecaConfig;
/**
 * Error class used for cases that can't be reached. It's a helper for TypeScript
 */
var UnreachableCaseError = /** @class */ (function (_super) {
    __extends(UnreachableCaseError, _super);
    /* istanbul ignore next */
    function UnreachableCaseError(val) {
        return _super.call(this, "Unreachable case: " + val) || this;
    }
    return UnreachableCaseError;
}(Error));
exports.UnreachableCaseError = UnreachableCaseError;
//# sourceMappingURL=helpers.js.map