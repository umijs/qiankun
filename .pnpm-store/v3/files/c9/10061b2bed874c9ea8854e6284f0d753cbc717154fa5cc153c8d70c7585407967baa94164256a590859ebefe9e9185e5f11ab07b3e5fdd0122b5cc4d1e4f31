"use strict";
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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
exports.removeFile = exports.getToken = exports.getUser = exports.saveUser = exports.deleteUser = exports.merge = exports.remove = exports.read = void 0;
var os_1 = require("os");
var fs = require("fs-extra");
var path = require("path");
var api = require("./utils/api");
var log_1 = require("./utils/log");
var env_1 = require("./utils/env");
// tslint:disable no-var-requires
var ms = require("ms");
var TTL = ms("8h");
var CONFIG_NAME = env_1.IS_STAGING
    ? ".codesandbox-staging.json"
    : ".codesandbox.json";
var file = process.env.CODESANDBOX_JSON
    ? path.resolve(process.env.CODESANDBOX_JSON)
    : path.resolve(os_1.homedir(), CONFIG_NAME);
/**
 * Save config file
 *
 * @param {Object} data data to save
 */
function save(data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.writeFile(file, JSON.stringify(data, null, 2))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Load and parse config file
 */
function read() {
    return __awaiter(this, void 0, void 0, function () {
        var existing, fileData, err_1, token, user, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existing = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs.readFile(file, "utf8")];
                case 2:
                    fileData = _a.sent();
                    existing = JSON.parse(fileData);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    if (!existing.token) {
                        return [2 /*return*/, {}];
                    }
                    if (!(!existing.lastUpdate || Date.now() - existing.lastUpdate > TTL)) return [3 /*break*/, 13];
                    token = existing.token;
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 11, , 13]);
                    return [4 /*yield*/, api.fetchUser(token)];
                case 6:
                    user = _a.sent();
                    if (!user) return [3 /*break*/, 8];
                    existing = __assign(__assign({}, existing), { user: user, lastUpdate: Date.now() });
                    return [4 /*yield*/, save(existing)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, deleteUser()];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [3 /*break*/, 13];
                case 11:
                    e_1 = _a.sent();
                    log_1.error("Could not authorize the user.");
                    return [4 /*yield*/, deleteUser()];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/, existing];
            }
        });
    });
}
exports.read = read;
// Removes a key from the config and store the result
function remove(key) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read()];
                case 1:
                    cfg = _a.sent();
                    if (key in cfg) {
                        delete cfg[key];
                    }
                    return [4 /*yield*/, fs.writeFile(file, JSON.stringify(cfg, null, 2))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.remove = remove;
/**
 * Merge the given data in the current config
 * @param data
 */
function merge(data) {
    return __awaiter(this, void 0, void 0, function () {
        var oldConfig, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read()];
                case 1:
                    oldConfig = _a.sent();
                    cfg = __assign(__assign({}, oldConfig), data);
                    return [4 /*yield*/, save(cfg)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, cfg];
            }
        });
    });
}
exports.merge = merge;
/**
 * Delete given user from config
 *
 * @export
 */
function deleteUser() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, save({})];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteUser = deleteUser;
/**
 * Save specific user in state
 *
 * @export
 * @param {User} user
 * @returns
 */
function saveUser(token, user) {
    return merge({ user: user, token: token, lastUpdate: Date.now() });
}
exports.saveUser = saveUser;
/**
 * Gets user from config
 *
 * @export
 * @returns
 */
function getUser() {
    return __awaiter(this, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read()];
                case 1:
                    cfg = _a.sent();
                    return [2 /*return*/, cfg.user];
            }
        });
    });
}
exports.getUser = getUser;
function getToken() {
    return __awaiter(this, void 0, void 0, function () {
        var cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read()];
                case 1:
                    cfg = _a.sent();
                    return [2 /*return*/, cfg.token];
            }
        });
    });
}
exports.getToken = getToken;
exports.removeFile = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, fs.remove(file)];
}); }); };
//# sourceMappingURL=cfg.js.map