#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var program = require("commander");
var updateNotifier = require("update-notifier");
// Commands
var deploy_1 = require("./commands/deploy");
var login_1 = require("./commands/login");
var logout_1 = require("./commands/logout");
var token_1 = require("./commands/token");
var log_1 = require("./utils/log");
// tslint:disable no-var-requires
var packageInfo = require("../package.json");
program.version(packageInfo.version);
program.on("--help", log_1.extraHelp);
// Register commands
deploy_1["default"](program);
login_1["default"](program);
token_1["default"](program);
logout_1["default"](program);
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    console.log();
    log_1.logCodeSandbox();
    console.log();
    program.outputHelp();
}
updateNotifier({ pkg: packageInfo }).notify();
//# sourceMappingURL=index.js.map