"use strict";
/** @module pkg-install */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var package_manager_utils_1 = require("./utils/package-manager-utils");
/**
 * Determine what package manager to use based on what preference is set,
 * and whether it's currently running in a yarn/npm script
 *
 * @export
 * @param {InstallConfig} config
 * @returns {Promise<SupportedPackageManagers>}
 */
function getPackageManager(config) {
    return __awaiter(this, void 0, void 0, function () {
        var pkgManager;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pkgManager = config.prefer || package_manager_utils_1.getCurrentPackageManager();
                    if (!!pkgManager) return [3 /*break*/, 2];
                    return [4 /*yield*/, package_manager_utils_1.getPackageManagerFromLockfile(config)];
                case 1:
                    pkgManager = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!pkgManager) {
                        pkgManager = 'npm';
                    }
                    return [4 /*yield*/, package_manager_utils_1.isManagerInstalled(pkgManager)];
                case 3:
                    if (!!(_a.sent())) return [3 /*break*/, 5];
                    pkgManager = pkgManager === 'npm' ? 'yarn' : 'npm';
                    return [4 /*yield*/, package_manager_utils_1.isManagerInstalled(pkgManager)];
                case 4:
                    if (!(_a.sent())) {
                        throw new Error('No supported package manager found');
                    }
                    _a.label = 5;
                case 5: return [2 /*return*/, pkgManager];
            }
        });
    });
}
exports.getPackageManager = getPackageManager;
/**
 * SYNC: Determine what package manager to use based on what preference is set,
 * and whether it's currently running in a yarn/npm script
 *
 * @export
 * @param {InstallConfig} config
 * @returns {SupportedPackageManagers}
 */
function getPackageManagerSync(config) {
    var pkgManager = config.prefer || package_manager_utils_1.getCurrentPackageManager();
    if (!pkgManager) {
        pkgManager = package_manager_utils_1.getPackageManagerFromLockfileSync(config);
    }
    if (!pkgManager) {
        pkgManager = 'npm';
    }
    if (!package_manager_utils_1.isManagerInstalledSync(pkgManager)) {
        pkgManager = pkgManager === 'npm' ? 'yarn' : 'npm';
        if (!package_manager_utils_1.isManagerInstalledSync(pkgManager)) {
            throw new Error('No supported package manager found');
        }
    }
    return pkgManager;
}
exports.getPackageManagerSync = getPackageManagerSync;
//# sourceMappingURL=package-manager.js.map