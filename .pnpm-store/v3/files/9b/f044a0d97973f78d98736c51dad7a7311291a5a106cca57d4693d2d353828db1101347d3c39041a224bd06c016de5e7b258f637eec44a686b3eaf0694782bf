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
exports.registerArtifacts = exports.invalidateArtifacts = exports.getArtifacts = void 0;
const path = __importStar(require("path"));
const config_1 = require("./config");
const system_1 = require("./system");
const tsbuildinfo_1 = require("./tsbuildinfo");
const typescript_1 = require("./typescript");
const worker_config_1 = require("./worker-config");
let artifacts;
function getArtifacts(force = false) {
    if (!artifacts || force) {
        const parsedConfig = (0, config_1.getParsedConfig)();
        artifacts = getArtifactsWorker(parsedConfig, worker_config_1.config.context);
    }
    return artifacts;
}
exports.getArtifacts = getArtifacts;
function invalidateArtifacts() {
    artifacts = undefined;
}
exports.invalidateArtifacts = invalidateArtifacts;
function registerArtifacts() {
    system_1.system.setArtifacts(getArtifacts());
}
exports.registerArtifacts = registerArtifacts;
function getArtifactsWorker(parsedConfig, configFileContext, processedConfigFiles = []) {
    const files = new Set();
    const dirs = new Set();
    if (parsedConfig.fileNames.length > 0) {
        if (parsedConfig.options.outFile) {
            files.add(path.resolve(configFileContext, parsedConfig.options.outFile));
        }
        const tsBuildInfoPath = (0, tsbuildinfo_1.getTsBuildInfoEmitPath)(parsedConfig.options);
        if (tsBuildInfoPath) {
            files.add(path.resolve(configFileContext, tsBuildInfoPath));
        }
        if (parsedConfig.options.outDir) {
            dirs.add(path.resolve(configFileContext, parsedConfig.options.outDir));
        }
    }
    for (const projectReference of parsedConfig.projectReferences || []) {
        const configFile = typescript_1.typescript.resolveProjectReferencePath(projectReference);
        if (processedConfigFiles.includes(configFile)) {
            // handle circular dependencies
            continue;
        }
        const parsedConfig = (0, config_1.parseConfig)(configFile, path.dirname(configFile));
        const childArtifacts = getArtifactsWorker(parsedConfig, configFileContext, [
            ...processedConfigFiles,
            configFile,
        ]);
        childArtifacts.files.forEach((file) => {
            files.add(file);
        });
        childArtifacts.dirs.forEach((dir) => {
            dirs.add(dir);
        });
    }
    const extensions = [
        typescript_1.typescript.Extension.Dts,
        typescript_1.typescript.Extension.Js,
        typescript_1.typescript.Extension.TsBuildInfo,
    ];
    return {
        files: Array.from(files).map((file) => path.normalize(file)),
        dirs: Array.from(dirs).map((dir) => path.normalize(dir)),
        excluded: [],
        extensions,
    };
}
