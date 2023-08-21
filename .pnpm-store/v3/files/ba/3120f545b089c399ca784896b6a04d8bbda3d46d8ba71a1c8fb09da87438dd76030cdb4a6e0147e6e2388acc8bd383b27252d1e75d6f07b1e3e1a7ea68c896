"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTypeScriptSupport = void 0;
const os_1 = __importDefault(require("os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const semver = __importStar(require("semver"));
function assertTypeScriptSupport(config) {
    let typescriptVersion;
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        typescriptVersion = require(config.typescriptPath).version;
    }
    catch (error) {
        // silent catch
    }
    if (!typescriptVersion) {
        throw new Error('When you use ForkTsCheckerWebpackPlugin with typescript reporter enabled, you must install `typescript` package.');
    }
    if (semver.lt(typescriptVersion, '3.6.0')) {
        throw new Error([
            `ForkTsCheckerWebpackPlugin cannot use the current typescript version of ${typescriptVersion}.`,
            'The minimum required version is 3.6.0.',
        ].join(os_1.default.EOL));
    }
    if (config.build && semver.lt(typescriptVersion, '3.8.0')) {
        throw new Error([
            `ForkTsCheckerWebpackPlugin doesn't support build option for the current typescript version of ${typescriptVersion}.`,
            'The minimum required version is 3.8.0.',
        ].join(os_1.default.EOL));
    }
    if (!fs_extra_1.default.existsSync(config.configFile)) {
        throw new Error([
            `Cannot find the "${config.configFile}" file.`,
            `Please check webpack and ForkTsCheckerWebpackPlugin configuration.`,
            `Possible errors:`,
            '  - wrong `context` directory in webpack configuration (if `configFile` is not set or is a relative path in the fork plugin configuration)',
            '  - wrong `typescript.configFile` path in the plugin configuration (should be a relative or absolute path)',
        ].join(os_1.default.EOL));
    }
}
exports.assertTypeScriptSupport = assertTypeScriptSupport;
