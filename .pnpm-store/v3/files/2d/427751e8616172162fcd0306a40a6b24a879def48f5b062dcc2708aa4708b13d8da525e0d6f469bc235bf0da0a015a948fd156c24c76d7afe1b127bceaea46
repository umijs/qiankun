"use strict";
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
exports.login = void 0;
var inquirer = require("inquirer");
var open = require("open");
var ora = require("ora");
var cfg = require("../cfg");
var api = require("../utils/api");
var confirm_1 = require("../utils/confirm");
var log_1 = require("../utils/log");
var url_1 = require("../utils/url");
/**
 * Start the sign in process by opening CodeSandbox CLI login url, this page
 * will show a token that the user will have to fill in in the CLI
 *
 * @returns
 */
function handleSignIn() {
    return __awaiter(this, void 0, void 0, function () {
        var authToken, spinner, _a, token, user, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Open specific url
                    log_1.info("Opening " + url_1.LOGIN_URL);
                    open(url_1.LOGIN_URL, { wait: false });
                    return [4 /*yield*/, inquirer.prompt([
                            {
                                message: "Token:",
                                name: "authToken",
                                type: "input"
                            },
                        ])];
                case 1:
                    authToken = (_b.sent()).authToken;
                    spinner = ora("Fetching user...").start();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, api.verifyUser(authToken)];
                case 3:
                    _a = _b.sent(), token = _a.token, user = _a.user;
                    // Save definite token and user to config
                    spinner.text = "Saving user...";
                    return [4 /*yield*/, cfg.saveUser(token, user)];
                case 4:
                    _b.sent();
                    spinner.stop();
                    return [2 /*return*/, user];
                case 5:
                    e_1 = _b.sent();
                    spinner.stop();
                    throw e_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function login() {
    return __awaiter(this, void 0, void 0, function () {
        var confirmed, user, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log_1.info("We will open CodeSandbox and show an authorization token.");
                    log_1.info("You'll need enter this token in the CLI to sign in.");
                    return [4 /*yield*/, confirm_1["default"]("We will open CodeSandbox to finish the login process.")];
                case 1:
                    confirmed = _a.sent();
                    console.log();
                    if (!confirmed) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, handleSignIn()];
                case 3:
                    user = _a.sent();
                    log_1.info("Succesfully signed in as " + user.username + "!");
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    log_1.error("Something went wrong while signing in: " + e_2.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.login = login;
function registerCLI(program) {
    var _this = this;
    program
        .command("login")
        .description("sign in to your CodeSandbox account or create a new one")
        .option("-s", "don't ask for sign in if you're already signed in")
        .action(function (cmd) { return __awaiter(_this, void 0, void 0, function () {
        var user, silent, confirmed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cfg.getUser()];
                case 1:
                    user = _a.sent();
                    silent = !!cmd.S;
                    if (!user) return [3 /*break*/, 5];
                    if (silent) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, confirm_1["default"]("You are already logged in, would you like to sign out first?")];
                case 2:
                    confirmed = _a.sent();
                    if (!confirmed) return [3 /*break*/, 4];
                    return [4 /*yield*/, cfg.deleteUser()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/];
                case 5: return [4 /*yield*/, login()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
exports["default"] = registerCLI;
//# sourceMappingURL=login.js.map