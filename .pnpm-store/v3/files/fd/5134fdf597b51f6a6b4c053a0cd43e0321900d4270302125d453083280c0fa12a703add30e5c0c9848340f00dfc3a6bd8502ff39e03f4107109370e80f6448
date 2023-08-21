"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flags_1 = require("./flags");
var helpers_1 = require("./helpers");
function constructYarnArguments(packageList, config) {
    var flagsToSet = flags_1.getFlagsToSet(config);
    var globalCommand = config.global ? ['global'] : [];
    var args = globalCommand.concat(['add'], packageList);
    var ignoredFlags = [];
    flagsToSet.forEach(function (flag) {
        switch (flag) {
            case 'dev':
                if (!config.global) {
                    args.push('--dev');
                }
                else {
                    ignoredFlags.push(flag);
                }
                break;
            case 'exact':
                args.push('--exact');
                break;
            case 'verbose':
                args.push('--verbose');
                break;
            case 'bundle':
            case 'noSave':
                ignoredFlags.push(flag);
                break;
            /* istanbul ignore next */
            default:
                throw new helpers_1.UnreachableCaseError(flag);
        }
    });
    return { args: args, ignoredFlags: ignoredFlags };
}
exports.constructYarnArguments = constructYarnArguments;
exports.yarnProjectInstallArgs = ['install'];
//# sourceMappingURL=yarn.js.map