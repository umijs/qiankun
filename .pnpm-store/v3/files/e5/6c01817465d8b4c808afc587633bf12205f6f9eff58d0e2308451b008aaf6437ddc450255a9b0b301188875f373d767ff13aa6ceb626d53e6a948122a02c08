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
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateDependencies = exports.getDependencies = void 0;
const path = __importStar(require("path"));
const config_1 = require("./config");
const typescript_1 = require("./typescript");
const worker_config_1 = require("./worker-config");
let dependencies;
function getDependencies(force = false) {
    if (!dependencies || force) {
        const parsedConfig = (0, config_1.getParsedConfig)();
        dependencies = getDependenciesWorker(parsedConfig, worker_config_1.config.context);
    }
    return dependencies;
}
exports.getDependencies = getDependencies;
function invalidateDependencies() {
    dependencies = undefined;
}
exports.invalidateDependencies = invalidateDependencies;
function getDependenciesWorker(parsedConfig, configFileContext, processedConfigFiles = []) {
    var _a;
    const files = new Set(parsedConfig.fileNames);
    const configFilePath = parsedConfig.options.configFilePath;
    if (typeof configFilePath === 'string') {
        files.add(configFilePath);
    }
    const dirs = new Set(Object.keys(parsedConfig.wildcardDirectories || {}));
    const excluded = new Set((((_a = parsedConfig.raw) === null || _a === void 0 ? void 0 : _a.exclude) || []).map((filePath) => path.resolve(configFileContext, filePath)));
    for (const projectReference of parsedConfig.projectReferences || []) {
        const childConfigFilePath = typescript_1.typescript.resolveProjectReferencePath(projectReference);
        const childConfigContext = path.dirname(childConfigFilePath);
        if (processedConfigFiles.includes(childConfigFilePath)) {
            // handle circular dependencies
            continue;
        }
        const childParsedConfig = (0, config_1.parseConfig)(childConfigFilePath, childConfigContext);
        const childDependencies = getDependenciesWorker(childParsedConfig, childConfigContext, [
            ...processedConfigFiles,
            childConfigFilePath,
        ]);
        childDependencies.files.forEach((file) => {
            files.add(file);
        });
        childDependencies.dirs.forEach((dir) => {
            dirs.add(dir);
        });
    }
    const extensions = [
        typescript_1.typescript.Extension.Ts,
        typescript_1.typescript.Extension.Tsx,
        typescript_1.typescript.Extension.Js,
        typescript_1.typescript.Extension.Jsx,
        typescript_1.typescript.Extension.TsBuildInfo,
    ];
    return {
        files: Array.from(files).map((file) => path.normalize(file)),
        dirs: Array.from(dirs).map((dir) => path.normalize(dir)),
        excluded: Array.from(excluded).map((aPath) => path.normalize(aPath)),
        extensions: extensions,
    };
}
