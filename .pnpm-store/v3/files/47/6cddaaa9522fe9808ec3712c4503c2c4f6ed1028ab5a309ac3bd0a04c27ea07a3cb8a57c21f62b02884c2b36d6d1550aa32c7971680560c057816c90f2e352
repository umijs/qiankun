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
var chalk_1 = require("chalk");
var filesize = require("filesize");
var create_sandbox_1 = require("codesandbox-import-utils/lib/create-sandbox");
var path_1 = require("path");
var cfg_1 = require("../cfg");
var api_1 = require("../utils/api");
var confirm_1 = require("../utils/confirm");
var log_1 = require("../utils/log");
var url_1 = require("../utils/url");
var login_1 = require("./login");
var parse_sandbox_1 = require("../utils/parse-sandbox");
var upload_files_1 = require("../utils/parse-sandbox/upload-files");
// tslint:disable no-var-requires
var ora = require("ora");
var MAX_MODULE_COUNT = 500;
var MAX_DIRECTORY_COUNT = 500;
/**
 * Show warnings for the errors that occured during mapping of files, we
 * still give the user to continue deployment without those files.
 *
 * @param {string} resolvedPath
 * @param {FileError[]} errors
 */
function showWarnings(resolvedPath, errors) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, errors_1, err, relativePath;
        return __generator(this, function (_a) {
            if (errors.length > 0) {
                console.log();
                log_1.log(chalk_1["default"].yellow("There are " + chalk_1["default"].bold(errors.length.toString()) + " files that cannot be deployed:"));
                for (_i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
                    err = errors_1[_i];
                    relativePath = err.path.replace(resolvedPath, "");
                    log_1.log(chalk_1["default"].yellow.bold(relativePath) + ": " + err.message);
                }
                console.log();
            }
            return [2 /*return*/];
        });
    });
}
function showUploads(resolvedPath, uploads) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (Object.keys(uploads).length > 0) {
                console.log();
                log_1.log(chalk_1["default"].blue("We will upload " + Object.keys(uploads).length + " static files to your CodeSandbox upload storage:"));
                Object.keys(uploads).forEach(function (path) {
                    var relativePath = path.replace(resolvedPath, "");
                    log_1.log(chalk_1["default"].yellow.bold(relativePath) + ": " + filesize(uploads[path].byteLength));
                });
                console.log();
            }
            return [2 /*return*/];
        });
    });
}
function registerCommand(program) {
    var _this = this;
    program
        .command("deploy <path>")
        .alias("*")
        .description("deploy an application to CodeSandbox " + chalk_1["default"].bold("(default)"))
        .action(function (path) { return __awaiter(_this, void 0, void 0, function () {
        var user, confirmed, resolvedPath, fileData, acceptPublic, finalFiles, spinner, uploadedFiles, sandbox, sandboxData, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cfg_1.getUser()];
                case 1:
                    user = _a.sent();
                    if (!!user) return [3 /*break*/, 4];
                    log_1.info("You need to sign in before you can deploy applications");
                    return [4 /*yield*/, confirm_1["default"]("Do you want to sign in using GitHub?")];
                case 2:
                    confirmed = _a.sent();
                    if (!confirmed) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, login_1.login()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    log_1.info("Deploying " + path + " to CodeSandbox");
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 17, , 18]);
                    resolvedPath = path_1.join("./", path);
                    if (resolvedPath.endsWith("/")) {
                        resolvedPath = resolvedPath.slice(0, -1);
                    }
                    return [4 /*yield*/, parse_sandbox_1["default"](resolvedPath)];
                case 6:
                    fileData = _a.sent();
                    // Show files that will be uploaded
                    return [4 /*yield*/, showUploads(resolvedPath, fileData.uploads)];
                case 7:
                    // Show files that will be uploaded
                    _a.sent();
                    // Show warnings for all errors
                    return [4 /*yield*/, showWarnings(resolvedPath, fileData.errors)];
                case 8:
                    // Show warnings for all errors
                    _a.sent();
                    log_1.info("By deploying to CodeSandbox, the code of your project will be made " +
                        chalk_1["default"].bold("public"));
                    return [4 /*yield*/, confirm_1["default"]("Are you sure you want to proceed with the deployment?", true)];
                case 9:
                    acceptPublic = _a.sent();
                    if (!acceptPublic) {
                        return [2 /*return*/];
                    }
                    finalFiles = fileData.files;
                    spinner = ora("").start();
                    if (!Object.keys(fileData.uploads).length) return [3 /*break*/, 11];
                    spinner.text = "Uploading files to CodeSandbox";
                    return [4 /*yield*/, upload_files_1["default"](fileData.uploads)];
                case 10:
                    uploadedFiles = _a.sent();
                    finalFiles = __assign(__assign({}, finalFiles), uploadedFiles);
                    _a.label = 11;
                case 11: return [4 /*yield*/, create_sandbox_1["default"](finalFiles)];
                case 12:
                    sandbox = _a.sent();
                    if (sandbox.modules.length > MAX_MODULE_COUNT) {
                        throw new Error("This project is too big, it contains " + sandbox.modules.length + " files which is more than the max of " + MAX_MODULE_COUNT + ".");
                    }
                    if (sandbox.directories.length > MAX_DIRECTORY_COUNT) {
                        throw new Error("This project is too big, it contains " + sandbox.directories.length + " directories which is more than the max of " + MAX_DIRECTORY_COUNT + ".");
                    }
                    spinner.text = "Deploying to CodeSandbox";
                    _a.label = 13;
                case 13:
                    _a.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, api_1.uploadSandbox(sandbox)];
                case 14:
                    sandboxData = _a.sent();
                    spinner.stop();
                    log_1.success("Succesfully created the sandbox, you can find the sandbox here:");
                    log_1.success(url_1.createSandboxUrl(sandboxData));
                    return [3 /*break*/, 16];
                case 15:
                    e_1 = _a.sent();
                    spinner.stop();
                    log_1.error("Something went wrong while uploading to the API");
                    log_1.error(e_1.message);
                    return [3 /*break*/, 16];
                case 16: return [3 /*break*/, 18];
                case 17:
                    e_2 = _a.sent();
                    log_1.error(e_2.message);
                    return [3 /*break*/, 18];
                case 18: return [2 /*return*/];
            }
        });
    }); });
}
exports["default"] = registerCommand;
//# sourceMappingURL=deploy.js.map