"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.Service = void 0;
const core_1 = require("@umijs/core");
const path_1 = __importDefault(require("path"));
const process = __importStar(require("process"));
const constants_1 = require("../constants");
class Service extends core_1.Service {
    constructor(opts) {
        let cwd = process.cwd();
        const appRoot = process.env.APP_ROOT;
        if (appRoot) {
            cwd = path_1.default.isAbsolute(appRoot) ? appRoot : path_1.default.join(cwd, appRoot);
        }
        super({
            ...opts,
            env: process.env.NODE_ENV,
            cwd,
            defaultConfigFiles: constants_1.DEFAULT_CONFIG_FILES,
            frameworkName: constants_1.FRAMEWORK_NAME,
            presets: [require.resolve('../preset')],
        });
    }
    async run2(opts) {
        let name = opts.name;
        if ((opts === null || opts === void 0 ? void 0 : opts.args.version) || name === 'v') {
            name = 'version';
        }
        else if ((opts === null || opts === void 0 ? void 0 : opts.args.help) || !name || name === 'h') {
            name = 'help';
        }
        return await this.run({ ...opts, name });
    }
}
exports.Service = Service;
