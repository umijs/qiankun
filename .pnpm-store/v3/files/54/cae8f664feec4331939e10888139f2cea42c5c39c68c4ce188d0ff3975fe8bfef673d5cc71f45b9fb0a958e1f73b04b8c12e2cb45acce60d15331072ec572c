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
exports.getDepPkgName = exports.getPkgNameFromPath = exports.isFilePath = exports.logger = exports.getNestedTypeDepsForPkg = exports.getDepPkgPath = exports.isBuiltInModule = exports.getDtsInfoForPkgPath = exports.getPkgNameWithTypesOrg = exports.getPkgNameFromTypesOrg = exports.getTypeFromPkgJson = exports.getCache = void 0;
const utils_1 = require("@umijs/utils");
const file_system_cache_1 = __importDefault(require("file-system-cache"));
const module_1 = require("module");
const path_1 = __importStar(require("path"));
const constants_1 = require("./constants");
const caches = {};
/**
 * get file-system cache for specific namespace
 */
function getCache(ns) {
    var _a;
    // return fake cache if cache disabled
    if (process.env.FATHER_CACHE === 'none') {
        return { set() { }, get() { }, setSync() { }, getSync() { } };
    }
    return ((_a = caches[ns]) !== null && _a !== void 0 ? _a : (caches[ns] = (0, file_system_cache_1.default)({ basePath: path_1.default.join(constants_1.CACHE_PATH, ns) })));
}
exports.getCache = getCache;
/**
 * get valid type field value from package.json
 */
function getTypeFromPkgJson(pkg) {
    return pkg.types || pkg.typing || pkg.typings;
}
exports.getTypeFromPkgJson = getTypeFromPkgJson;
/**
 * restore xxx for @types/xxx
 */
function getPkgNameFromTypesOrg(name) {
    return name.replace('@types/', '').replace(/^([^]+?)__([^]+)$/, '@$1/$2');
}
exports.getPkgNameFromTypesOrg = getPkgNameFromTypesOrg;
/**
 * get @types/xxx for xxx
 */
function getPkgNameWithTypesOrg(name) {
    return `@types/${name.replace('@', '').replace('/', '__')}`;
}
exports.getPkgNameWithTypesOrg = getPkgNameWithTypesOrg;
/**
 * get d.ts file path and package path for NPM package.json path
 */
function getDtsInfoForPkgPath(pkgPath) {
    const pkg = require(pkgPath);
    const info = { pkgPath: pkgPath, dtsPath: getTypeFromPkgJson(pkg) };
    if (info.dtsPath) {
        // resolve builtin types
        info.dtsPath = path_1.default.resolve(path_1.default.dirname(pkgPath), info.dtsPath);
    }
    else {
        // resolve @types/xxx pkg
        try {
            info.pkgPath = require.resolve(`${getPkgNameWithTypesOrg(pkg.name)}/package.json`, {
                paths: [pkgPath],
            });
            info.dtsPath = path_1.default.resolve(path_1.default.dirname(info.pkgPath), getTypeFromPkgJson(require(info.pkgPath)));
        }
        catch {
            return null;
        }
    }
    return info;
}
exports.getDtsInfoForPkgPath = getDtsInfoForPkgPath;
/**
 * Determine if it is a native module
 */
const isBuiltInModule = (pkgName) => module_1.builtinModules.includes(pkgName.replace(/^node:/, ''));
exports.isBuiltInModule = isBuiltInModule;
/**
 * get package.json path for specific NPM package
 * @see https://github.com/nodejs/node/issues/33460
 */
function getDepPkgPath(dep, cwd) {
    try {
        return require.resolve(`${dep}/package.json`, { paths: [cwd] });
    }
    catch {
        return utils_1.pkgUp.pkgUpSync({
            cwd: require.resolve(dep, { paths: [cwd] }),
        });
    }
}
exports.getDepPkgPath = getDepPkgPath;
/**
 * get all nested type dependencies for specific NPM package
 */
function getNestedTypeDepsForPkg(name, cwd, externals, deps) {
    const isWithinTypes = name.startsWith('@types/');
    const pkgName = isWithinTypes ? getPkgNameFromTypesOrg(name) : name;
    const typesPkgName = isWithinTypes ? name : getPkgNameWithTypesOrg(name);
    const isCollected = (deps === null || deps === void 0 ? void 0 : deps.hasOwnProperty(name)) || (deps === null || deps === void 0 ? void 0 : deps.hasOwnProperty(typesPkgName));
    const isExternalized = externals[pkgName] || externals[typesPkgName];
    if (deps && (isCollected || isExternalized))
        return deps;
    const isTopLevel = !deps;
    const dtsInfo = getDtsInfoForPkgPath(getDepPkgPath(name, cwd));
    const pkgJson = dtsInfo ? require(dtsInfo.pkgPath) : {};
    const pkgDeps = pkgJson.dependencies || {};
    // collect nested packages and exclude self
    deps !== null && deps !== void 0 ? deps : (deps = {});
    Object.assign(deps, isTopLevel ? {} : { [pkgJson.name]: pkgJson.version });
    Object.keys(pkgDeps).forEach((item) => {
        getNestedTypeDepsForPkg(item, dtsInfo.pkgPath, externals, deps);
    });
    return deps;
}
exports.getNestedTypeDepsForPkg = getNestedTypeDepsForPkg;
exports.logger = new Proxy({}, {
    get(target, prop, receiver) {
        // implement setQuiet
        if (prop === 'setQuiet') {
            return (quiet) => {
                target._quiet = quiet;
            };
        }
        // implement quietOnly
        if (prop === 'quietOnly') {
            return new Proxy({}, {
                get: (_, prop) => {
                    return target._quiet
                        ? this.get(target, prop, receiver)
                        : () => { };
                },
            });
        }
        // implement quietExpect
        if (prop === 'quietExpect') {
            return new Proxy({}, {
                get: (_, prop) => {
                    return target._quiet
                        ? () => { }
                        : this.get(target, prop, receiver);
                },
            });
        }
        // prefix time for development
        if (prop in utils_1.logger.prefixes &&
            process.env.NODE_ENV === 'development') {
            return utils_1.logger[prop].bind(utils_1.logger, utils_1.chalk.gray(`[${new Date().toLocaleTimeString(undefined, { hour12: false })}]`));
        }
        // fallback to return normal logger
        return utils_1.logger[prop];
    },
});
function isFilePath(path) {
    return (0, path_1.isAbsolute)(path) || path.startsWith('.');
}
exports.isFilePath = isFilePath;
function getPkgNameFromPath(p) {
    var _a;
    return (_a = p.match(/^(?:@[a-z\d][\w-.]*\/)?[a-z\d][\w-.]*/i)) === null || _a === void 0 ? void 0 : _a[0];
}
exports.getPkgNameFromPath = getPkgNameFromPath;
const getDepPkgName = (name, packageJson) => {
    var _a;
    if (isFilePath(name)) {
        return packageJson.name;
    }
    return (_a = getPkgNameFromPath(name)) !== null && _a !== void 0 ? _a : name;
};
exports.getDepPkgName = getDepPkgName;
