"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flags_1 = require("./flags");
var helpers_1 = require("./helpers");
function constructNpmArguments(packageList, config) {
    var flagsToSet = flags_1.getFlagsToSet(config);
    var globalCommand = config.global ? ['-g'] : [];
    var args = ['install'].concat(globalCommand, packageList);
    var ignoredFlags = [];
    flagsToSet.forEach(function (flag) {
        switch (flag) {
            case 'dev':
                if (!config.global) {
                    args.push('--save-dev');
                }
                else {
                    ignoredFlags.push(flag);
                }
                break;
            case 'exact':
                args.push('--save-exact');
                break;
            case 'verbose':
                args.push('--verbose');
                break;
            case 'bundle':
                args.push('--save-bundle');
                break;
            case 'noSave':
                args.push('--no-save');
                break;
            /* istanbul ignore next */
            default:
                throw new helpers_1.UnreachableCaseError(flag);
        }
    });
    return { args: args, ignoredFlags: ignoredFlags };
}
exports.constructNpmArguments = constructNpmArguments;
exports.npmProjectInstallArgs = ['install'];
//# sourceMappingURL=npm.js.map