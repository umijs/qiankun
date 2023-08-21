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
var fs = require("fs-extra");
var path = require("path");
var is_text_1 = require("codesandbox-import-utils/lib/is-text");
var file_error_1 = require("./file-error");
var MAX_FILE_SIZE = 5 * 1024 * 1024;
function normalizeFilesInDirectory(p, startingPath) {
    return __awaiter(this, void 0, void 0, function () {
        var entries, dirs, files, errors, uploads, recursiveDirs, fileData;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readdir(p)];
                case 1:
                    entries = _a.sent();
                    dirs = [];
                    files = [];
                    errors = [];
                    uploads = {};
                    return [4 /*yield*/, Promise.all(entries.map(function (e) { return __awaiter(_this, void 0, void 0, function () {
                            var absolutePath, stat;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        absolutePath = path.join(p, e);
                                        return [4 /*yield*/, fs.stat(absolutePath)];
                                    case 1:
                                        stat = _a.sent();
                                        if (stat.isDirectory()) {
                                            if (e !== "node_modules" && e !== ".git") {
                                                dirs.push(absolutePath);
                                            }
                                        }
                                        else {
                                            files.push(absolutePath);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Promise.all(dirs.map(function (d) { return normalizeFilesInDirectory(d, startingPath); }))];
                case 3:
                    recursiveDirs = (_a.sent()).reduce(function (prev, next) {
                        next.errors.forEach(function (e) {
                            errors.push(e);
                        });
                        uploads = __assign(__assign({}, next.uploads), uploads);
                        return __assign(__assign({}, prev), next.files);
                    }, {});
                    return [4 /*yield*/, Promise.all(files.map(function (t) { return __awaiter(_this, void 0, void 0, function () {
                            var code, relativePath, isBinary;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fs.readFile(t)];
                                    case 1:
                                        code = _a.sent();
                                        relativePath = t.replace(startingPath + "/", "");
                                        return [4 /*yield*/, is_text_1.isText(t, code)];
                                    case 2:
                                        isBinary = !(_a.sent());
                                        if (isBinary) {
                                            if (code.byteLength > MAX_FILE_SIZE) {
                                                errors.push(new file_error_1["default"](is_text_1.isTooBig(code) ? "Is too big" : "Is a binary file", relativePath, true));
                                                return [2 /*return*/, false];
                                            }
                                            else {
                                                uploads[relativePath] = code;
                                                return [2 /*return*/, false];
                                            }
                                        }
                                        return [2 /*return*/, { path: relativePath, code: code.toString() }];
                                }
                            });
                        }); }))];
                case 4:
                    fileData = (_a.sent()).reduce(function (prev, next) {
                        var _a;
                        if (next === false) {
                            return prev;
                        }
                        return __assign(__assign({}, prev), (_a = {}, _a[next.path] = { content: next.code }, _a));
                    }, {});
                    return [2 /*return*/, { errors: errors, uploads: uploads, files: __assign(__assign({}, recursiveDirs), fileData) }];
            }
        });
    });
}
var exists = function (p) { return __awaiter(void 0, void 0, void 0, function () {
    var stat, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fs.stat(p)];
            case 1:
                stat = _a.sent();
                return [2 /*return*/, true];
            case 2:
                e_1 = _a.sent();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * This will take a path and return all parameters that are relevant for the call
 * to the CodeSandbox API fir creating a sandbox
 *
 * @export
 * @param {string} path
 */
function parseSandbox(resolvedPath) {
    return __awaiter(this, void 0, void 0, function () {
        var dirExists, fileData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exists(resolvedPath)];
                case 1:
                    dirExists = _a.sent();
                    if (!dirExists) {
                        throw new Error("The given path (" + resolvedPath + ") doesn't exist.");
                    }
                    return [4 /*yield*/, normalizeFilesInDirectory(resolvedPath, resolvedPath)];
                case 2:
                    fileData = _a.sent();
                    return [2 /*return*/, fileData];
            }
        });
    });
}
exports["default"] = parseSandbox;
//# sourceMappingURL=index.js.map