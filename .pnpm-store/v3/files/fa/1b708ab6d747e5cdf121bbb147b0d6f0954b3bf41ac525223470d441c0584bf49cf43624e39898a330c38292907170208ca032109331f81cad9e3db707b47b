"use strict";
exports.__esModule = true;
exports.createSandboxUrl = exports.verifyUserTokenUrl = exports.LOGIN_URL = exports.GET_USER_URL = exports.CREATE_UPLOAD_URL = exports.CREATE_SANDBOX_URL = exports.BASE_URL = void 0;
var env_1 = require("./env");
exports.BASE_URL = env_1.IS_STAGING
    ? "https://codesandbox.stream"
    : "https://codesandbox.io";
exports.CREATE_SANDBOX_URL = exports.BASE_URL + "/api/v1/sandboxes";
exports.CREATE_UPLOAD_URL = exports.BASE_URL + "/api/v1/users/current_user/uploads";
exports.GET_USER_URL = exports.BASE_URL + "/api/v1/users/current";
exports.LOGIN_URL = exports.BASE_URL + "/cli/login";
var VERIFY_USER_TOKEN_URL = exports.BASE_URL + "/api/v1/auth/verify/";
exports.verifyUserTokenUrl = function (token) {
    return VERIFY_USER_TOKEN_URL + token;
};
exports.createSandboxUrl = function (sandbox) {
    return exports.BASE_URL + "/s/" + sandbox.id;
};
//# sourceMappingURL=url.js.map