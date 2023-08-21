"use strict";
exports.__esModule = true;
exports.success = exports.warn = exports.error = exports.info = exports.extraHelp = exports.logCodeSandbox = exports.log = void 0;
var chalk_1 = require("chalk");
function log(text) {
    if (text === void 0) { text = ""; }
    console.log("> " + text);
}
exports.log = log;
function logCodeSandbox() {
    console.log("  " + chalk_1["default"].blue.bold("Code") + chalk_1["default"].yellow.bold("Sandbox") + " " + chalk_1["default"].bold("CLI"));
    console.log("  The official CLI for uploading projects to CodeSandbox");
}
exports.logCodeSandbox = logCodeSandbox;
function extraHelp() {
    console.log("");
    console.log("  Notes:");
    console.log();
    console.log("    - You can only use the CLI if you are logged in");
    console.log();
    console.log("  Examples:");
    console.log("");
    console.log(chalk_1["default"].gray("    Deploy current directory:"));
    console.log();
    console.log("    $ codesandbox ./");
    console.log();
    console.log(chalk_1["default"].gray("    Deploy custom directory:"));
    console.log();
    console.log("    $ codesandbox /usr/src/project");
    console.log("");
}
exports.extraHelp = extraHelp;
function info(text) {
    log(chalk_1["default"].blue(text));
}
exports.info = info;
function error(text) {
    console.log();
    log(chalk_1["default"].red("[error] " + text));
    console.log();
}
exports.error = error;
function warn(text) {
    log(chalk_1["default"].yellow("[warn] " + text));
}
exports.warn = warn;
function success(text) {
    log(chalk_1["default"].green("[success] " + text));
}
exports.success = success;
//# sourceMappingURL=log.js.map