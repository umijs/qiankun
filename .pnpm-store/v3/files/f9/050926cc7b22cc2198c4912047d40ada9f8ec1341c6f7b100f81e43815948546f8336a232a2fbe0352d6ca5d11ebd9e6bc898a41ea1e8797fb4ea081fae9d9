"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentHash = exports.getBabelStyledComponentsOpts = exports.getBundlessTargets = exports.getBundleTargets = exports.ensureRelativePath = exports.getSWCTransformReactOpts = exports.getBabelPresetReactOpts = exports.getBaseTransformReactOpts = exports.addSourceMappingUrl = void 0;
const utils_1 = require("@umijs/utils");
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
const types_1 = require("../types");
const dts_1 = require("./bundless/dts");
function addSourceMappingUrl(code, loc) {
    return (code +
        '\n//# sourceMappingURL=' +
        path_1.default.basename(loc.replace(/\.(jsx|tsx?)$/, '.js.map')));
}
exports.addSourceMappingUrl = addSourceMappingUrl;
function getBaseTransformReactOpts(pkg, cwd) {
    var _a, _b;
    let isNewJSX;
    let opts = {};
    const reactVer = Object.assign({}, pkg.dependencies, pkg.peerDependencies).react;
    const tsconfig = (0, dts_1.getTsconfig)(cwd);
    /* istanbul ignore else -- @preserve */
    if (((_a = tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.options) === null || _a === void 0 ? void 0 : _a.jsx) !== undefined) {
        // respect tsconfig first, `4` means `react-jsx`
        isNewJSX = ((_b = tsconfig.options) === null || _b === void 0 ? void 0 : _b.jsx) === 4;
    }
    else if (reactVer) {
        // fallback to match react versions which support new JSX transform
        // ref: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#how-to-upgrade-to-the-new-jsx-transform
        isNewJSX = utils_1.semver.subset(reactVer, '>=17.0.0-0||^16.14.0||^15.7.0||^0.14.10');
    }
    else {
        return false;
    }
    opts = {
        // force use production mode, to make sure dist of dev/build are consistent
        // ref: https://github.com/umijs/umi/blob/6f63435d42f8ef7110f73dcf33809e6cda750332/packages/babel-preset-umi/src/index.ts#L45
        development: false,
        // set jsx runtime automatically
        runtime: isNewJSX ? 'automatic' : 'classic',
        ...(isNewJSX ? {} : { importSource: undefined }),
    };
    return opts;
}
exports.getBaseTransformReactOpts = getBaseTransformReactOpts;
function getBabelPresetReactOpts(pkg, cwd) {
    return {
        ...getBaseTransformReactOpts(pkg, cwd),
    };
}
exports.getBabelPresetReactOpts = getBabelPresetReactOpts;
function getSWCTransformReactOpts(pkg, cwd) {
    return {
        ...getBaseTransformReactOpts(pkg, cwd),
    };
}
exports.getSWCTransformReactOpts = getSWCTransformReactOpts;
function ensureRelativePath(relativePath) {
    // prefix . for same-level path
    if (!relativePath.startsWith('.')) {
        relativePath = `./${relativePath}`;
    }
    return relativePath;
}
exports.ensureRelativePath = ensureRelativePath;
const defaultCompileTarget = {
    [types_1.IFatherPlatformTypes.BROWSER]: {
        [types_1.IFatherJSTransformerTypes.BABEL]: { ie: 11 },
        [types_1.IFatherJSTransformerTypes.ESBUILD]: ['chrome51'],
        [types_1.IFatherJSTransformerTypes.SWC]: { ie: 11 },
    },
    [types_1.IFatherPlatformTypes.NODE]: {
        [types_1.IFatherJSTransformerTypes.BABEL]: { node: 14 },
        [types_1.IFatherJSTransformerTypes.ESBUILD]: ['node14'],
        [types_1.IFatherJSTransformerTypes.SWC]: { node: 14 },
    },
};
function getBundleTargets({ targets }) {
    if (!targets || !Object.keys(targets).length) {
        return defaultCompileTarget[types_1.IFatherPlatformTypes.BROWSER][types_1.IFatherJSTransformerTypes.BABEL];
    }
    return targets;
}
exports.getBundleTargets = getBundleTargets;
function getBundlessTargets(config) {
    const { platform, transformer, targets } = config;
    // targets is undefined or empty, fallback to default
    if (!targets || !Object.keys(targets).length) {
        return defaultCompileTarget[platform][transformer];
    }
    // esbuild accept string or string[]
    if (transformer === types_1.IFatherJSTransformerTypes.ESBUILD) {
        return Object.keys(targets).map((name) => `${name}${targets[name]}`);
    }
    return targets;
}
exports.getBundlessTargets = getBundlessTargets;
function getBabelStyledComponentsOpts(pkg) {
    var _a;
    let opts = false;
    // enable styled-components plugin for styled-components-based projects
    if ((_a = pkg.dependencies) === null || _a === void 0 ? void 0 : _a['styled-components']) {
        opts = { fileName: false };
        // set namespace for avoid className conflicts
        if (pkg.name) {
            const [name, org] = pkg.name.split('/').reverse();
            // hash org to make namespace clear
            const suffix = org
                ? `-${getContentHash(org, 4)}`
                : /* istanbul ignore next -- @preserve */
                    '';
            opts.namespace = `${name}${suffix}`;
        }
    }
    return opts;
}
exports.getBabelStyledComponentsOpts = getBabelStyledComponentsOpts;
function getContentHash(content, length = 8) {
    return (0, crypto_1.createHash)('md5').update(content).digest('hex').slice(0, length);
}
exports.getContentHash = getContentHash;
