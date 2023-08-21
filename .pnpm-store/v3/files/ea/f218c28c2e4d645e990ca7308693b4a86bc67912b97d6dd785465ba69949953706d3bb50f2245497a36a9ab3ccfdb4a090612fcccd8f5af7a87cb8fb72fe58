"use strict";
/** @module pkg-install */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var config_1 = require("./config");
var helpers_1 = require("./helpers");
var npm_1 = require("./npm");
var package_manager_1 = require("./package-manager");
var yarn_1 = require("./yarn");
/**
 * Installs a passed set of packages using either npm or yarn. Depending on:
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) What package manager is available
 *
 * @export
 * @param {Packages} packages List or object of packages to be installed
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {Promise<InstallResult>}
 */
function install(packages, options) {
    if (options === void 0) { options = config_1.defaultInstallConfig; }
    return __awaiter(this, void 0, void 0, function () {
        var config, pkgManager, packageList, getArguments, _a, args, ignoredFlags, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config = __assign({}, config_1.defaultInstallConfig, options);
                    return [4 /*yield*/, package_manager_1.getPackageManager(config)];
                case 1:
                    pkgManager = _b.sent();
                    packageList = helpers_1.getPackageList(packages);
                    getArguments = pkgManager === 'npm' ? npm_1.constructNpmArguments : yarn_1.constructYarnArguments;
                    _a = getArguments(packageList, config), args = _a.args, ignoredFlags = _a.ignoredFlags;
                    return [4 /*yield*/, execa_1.default(pkgManager, args, helpers_1.getExecaConfig(config))];
                case 2:
                    result = _b.sent();
                    return [2 /*return*/, __assign({}, result, { ignoredFlags: ignoredFlags })];
            }
        });
    });
}
exports.install = install;
/**
 * SYNC VERSION. Installs a passed set of packages using either npm or yarn. Depending on:
 *
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) If there is a yarn.lock or package-lock.json available
 * 4) What package manager is available
 *
 * @export
 * @param {Packages} packages List or object of packages to be installed
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {InstallResult}
 */
function installSync(packages, options) {
    if (options === void 0) { options = config_1.defaultInstallConfig; }
    var config = __assign({}, config_1.defaultInstallConfig, options);
    var pkgManager = package_manager_1.getPackageManagerSync(config);
    var packageList = helpers_1.getPackageList(packages);
    var getArguments = pkgManager === 'npm' ? npm_1.constructNpmArguments : yarn_1.constructYarnArguments;
    var _a = getArguments(packageList, config), args = _a.args, ignoredFlags = _a.ignoredFlags;
    var result = execa_1.default.sync(pkgManager, args, helpers_1.getExecaConfig(config));
    return __assign({}, result, { ignoredFlags: ignoredFlags });
}
exports.installSync = installSync;
/**
 * Runs `npm install` or `yarn install` for the project. Depending on:
 *
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) If there is a yarn.lock or package-lock.json available
 * 4) What package manager is available
 *
 * @export
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {Promise<execa.ExecaReturns>}
 */
function projectInstall(options) {
    if (options === void 0) { options = config_1.defaultInstallConfig; }
    return __awaiter(this, void 0, void 0, function () {
        var config, pkgManager, args;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = __assign({}, config_1.defaultInstallConfig, options);
                    return [4 /*yield*/, package_manager_1.getPackageManager(config)];
                case 1:
                    pkgManager = _a.sent();
                    args = pkgManager === 'npm' ? npm_1.npmProjectInstallArgs : yarn_1.yarnProjectInstallArgs;
                    return [2 /*return*/, execa_1.default(pkgManager, args, helpers_1.getExecaConfig(config))];
            }
        });
    });
}
exports.projectInstall = projectInstall;
/**
 * SYNC VERSION. Runs `npm install` or `yarn install` for the project. Depending on:
 *
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) If there is a yarn.lock or package-lock.json available
 * 4) What package manager is available
 *
 * @export
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {execa.ExecaReturns}
 */
function projectInstallSync(options) {
    if (options === void 0) { options = config_1.defaultInstallConfig; }
    var config = __assign({}, config_1.defaultInstallConfig, options);
    var pkgManager = package_manager_1.getPackageManagerSync(config);
    var args = pkgManager === 'npm' ? npm_1.npmProjectInstallArgs : yarn_1.yarnProjectInstallArgs;
    return execa_1.default.sync(pkgManager, args, helpers_1.getExecaConfig(config));
}
exports.projectInstallSync = projectInstallSync;
//# sourceMappingURL=install.js.map