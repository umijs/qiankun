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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var execa_1 = __importDefault(require("execa"));
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var util_1 = require("util");
var access = util_1.promisify(fs_1.access);
/**
 * Checks if a given package manager is currently installed by checking its version
 *
 * @export
 * @param {SupportedPackageManagers} manager
 * @returns {Promise<boolean>}
 */
function isManagerInstalled(manager) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, execa_1.default(manager, ['--version'])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, !result.failed];
            }
        });
    });
}
exports.isManagerInstalled = isManagerInstalled;
/**
 * SYNC: Checks if a given package manager is currently installed by checking its version
 *
 * @export
 * @param {SupportedPackageManagers} manager
 * @returns {boolean}
 */
function isManagerInstalledSync(manager) {
    var result = execa_1.default.sync(manager, ['--version']);
    return !result.failed;
}
exports.isManagerInstalledSync = isManagerInstalledSync;
/**
 * Returns the package manager currently active if the program is executed
 * through an npm or yarn script like:
 * ```bash
 * yarn run example
 * npm run example
 * ```
 *
 * @export
 * @returns {(SupportedPackageManagers | null)}
 */
function getCurrentPackageManager() {
    var userAgent = process.env.npm_config_user_agent;
    if (!userAgent) {
        return null;
    }
    if (userAgent.startsWith('npm')) {
        return 'npm';
    }
    if (userAgent.startsWith('yarn')) {
        return 'yarn';
    }
    return null;
}
exports.getCurrentPackageManager = getCurrentPackageManager;
/**
 * Checks for the presence of package-lock.json or yarn.lock to determine which package manager is being used
 *
 * @export
 * @param {InstallConfig} config Config specifying current working directory
 * @returns
 */
function getPackageManagerFromLockfile(config) {
    return __awaiter(this, void 0, void 0, function () {
        var pkgLockPath, yarnLockPath, err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pkgLockPath = path_1.default.join(config.cwd, 'package-lock.json');
                    yarnLockPath = path_1.default.join(config.cwd, 'yarn.lock');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 8]);
                    return [4 /*yield*/, access(pkgLockPath)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, 'npm'];
                case 3:
                    err_1 = _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, access(yarnLockPath)];
                case 5:
                    _a.sent();
                    return [2 /*return*/, 'yarn'];
                case 6:
                    err_2 = _a.sent();
                    return [2 /*return*/, null];
                case 7: return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.getPackageManagerFromLockfile = getPackageManagerFromLockfile;
/**
 * SYNC: Checks for the presence of package-lock.json or yarn.lock to determine which package manager is being used
 *
 * @export
 * @param {InstallConfig} config Config specifying current working directory
 * @returns
 */
function getPackageManagerFromLockfileSync(config) {
    var pkgLockPath = path_1.default.join(config.cwd, 'package-lock.json');
    var yarnLockPath = path_1.default.join(config.cwd, 'yarn.lock');
    try {
        fs_1.accessSync(pkgLockPath);
        return 'npm';
    }
    catch (err) {
        try {
            fs_1.accessSync(yarnLockPath);
            return 'yarn';
        }
        catch (err) {
            return null;
        }
    }
}
exports.getPackageManagerFromLockfileSync = getPackageManagerFromLockfileSync;
//# sourceMappingURL=package-manager-utils.js.map