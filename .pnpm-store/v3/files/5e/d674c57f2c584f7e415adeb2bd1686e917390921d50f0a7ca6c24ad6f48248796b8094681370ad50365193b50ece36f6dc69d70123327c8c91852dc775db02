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
exports.createUpload = exports.verifyUser = exports.fetchUser = exports.uploadSandbox = void 0;
var axios_1 = require("axios");
var lodash_1 = require("lodash");
var humps_1 = require("humps");
var cfg_1 = require("../cfg");
var url_1 = require("./url");
// tslint:disable-next-line:no-var-requires
var DatauriParser = require("datauri/parser");
var callApi = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1["default"](options)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data.data];
            case 2:
                e_1 = _a.sent();
                if (e_1.response && e_1.response.data && e_1.response.data.errors) {
                    e_1.message = lodash_1.values(e_1.response.data.errors)[0];
                }
                throw e_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
function uploadSandbox(sandbox) {
    return __awaiter(this, void 0, void 0, function () {
        var token, sandboxData, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cfg_1.getToken()];
                case 1:
                    token = _a.sent();
                    if (token == null) {
                        throw new Error("You're not signed in");
                    }
                    sandboxData = __assign(__assign({}, humps_1.decamelizeKeys(sandbox)), { from_cli: true });
                    options = {
                        data: {
                            sandbox: sandboxData
                        },
                        headers: {
                            Authorization: "Bearer " + token
                        },
                        method: "POST",
                        url: url_1.CREATE_SANDBOX_URL
                    };
                    return [2 /*return*/, callApi(options)];
            }
        });
    });
}
exports.uploadSandbox = uploadSandbox;
function fetchUser(token) {
    return __awaiter(this, void 0, void 0, function () {
        var Authorization, options;
        return __generator(this, function (_a) {
            Authorization = "Bearer " + token;
            options = {
                headers: {
                    Authorization: Authorization
                },
                method: "GET",
                url: url_1.GET_USER_URL
            };
            return [2 /*return*/, callApi(options)];
        });
    });
}
exports.fetchUser = fetchUser;
function verifyUser(token) {
    return __awaiter(this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
            options = {
                method: "GET",
                url: url_1.verifyUserTokenUrl(token)
            };
            return [2 /*return*/, callApi(options)];
        });
    });
}
exports.verifyUser = verifyUser;
function createUpload(filename, buffer) {
    return __awaiter(this, void 0, void 0, function () {
        var parser, uri, token, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parser = new DatauriParser();
                    parser.format(filename, buffer);
                    uri = parser.content;
                    return [4 /*yield*/, cfg_1.getToken()];
                case 1:
                    token = _a.sent();
                    if (token == null) {
                        throw new Error("You're not signed in");
                    }
                    options = {
                        data: {
                            name: filename,
                            content: uri
                        },
                        headers: {
                            Authorization: "Bearer " + token
                        },
                        method: "POST",
                        url: url_1.CREATE_UPLOAD_URL
                    };
                    return [2 /*return*/, callApi(options)];
            }
        });
    });
}
exports.createUpload = createUpload;
//# sourceMappingURL=api.js.map