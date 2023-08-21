"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceDirs = exports.registerRules = void 0;
const utils_1 = require("@umijs/utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../builder/config");
const constants_1 = require("../constants");
const config_2 = require("../prebundler/config");
const parser_1 = __importDefault(require("./parser"));
/**
 * register all built-in rules
 */
function registerRules(api) {
    const ruleDir = path_1.default.join(__dirname, 'rules');
    const rules = fs_1.default
        .readdirSync(ruleDir, { withFileTypes: true })
        .filter((f) => f.isFile() && /(?<!\.d)\.(j|t)s$/.test(f.name))
        .map((f) => path_1.default.join(ruleDir, f.name));
    api.registerPlugins(rules);
}
exports.registerRules = registerRules;
/**
 * get top-level source dirs from configs
 */
function getSourceDirs(bundleConfigs, bundlessConfigs) {
    const configDirs = utils_1.lodash.uniq([
        ...bundleConfigs.map((c) => path_1.default.dirname(c.entry)),
        ...bundlessConfigs.map((c) => c.input),
    ]);
    return [...configDirs].filter((d, i) => configDirs.every((dir, j) => i === j || !d.startsWith(dir)));
}
exports.getSourceDirs = getSourceDirs;
exports.default = async (api) => {
    // generate configs
    const configProviders = (0, config_1.createConfigProviders)(api.config, api.pkg, api.cwd);
    const bundleConfigs = [];
    const bundlessConfigs = [];
    const bundleProviders = [configProviders.bundle].filter(Boolean);
    const bundlessProviders = [
        configProviders.bundless.esm,
        configProviders.bundless.cjs,
    ].filter(Boolean);
    // extract configs from configProviders
    bundleProviders.forEach((provider) => bundleConfigs.push(...provider.configs));
    bundlessProviders.forEach((provider) => bundlessConfigs.push(...provider.configs));
    const preBundleConfig = (0, config_2.getConfig)({
        userConfig: api.config.prebundle || { deps: [] },
        pkg: api.pkg,
        cwd: api.cwd,
    });
    // collect all source files
    const sourceDirs = getSourceDirs(bundleConfigs, bundlessConfigs);
    const sourceFiles = sourceDirs
        .reduce((ret, dir) => ret.concat(utils_1.glob.sync(`${dir}/**`, {
        cwd: api.cwd,
        ignore: constants_1.DEFAULT_BUNDLESS_IGNORES,
        nodir: true,
    })), [])
        .filter((f) => 
    // include all files if bundle only
    !bundlessProviders.length ||
        // skip custom ignore files if has bundless config
        bundlessProviders.some((p) => p.getConfigForFile(f)));
    // collect all alias & externals
    // TODO: split bundle & bundless checkup, because externals not work for bundle
    const mergedAlias = {};
    const mergedExternals = {};
    [...bundleConfigs, ...bundlessConfigs].forEach((c) => {
        Object.entries(c.alias || {}).forEach(([k, v]) => {
            var _a;
            (_a = mergedAlias[k]) !== null && _a !== void 0 ? _a : (mergedAlias[k] = []);
            mergedAlias[k].push(v);
        });
        if ('externals' in c) {
            Object.entries(c.externals || {}).forEach(([k, v]) => {
                mergedExternals[k] = true;
            });
        }
    });
    // regular checkup
    const regularReport = await api.applyPlugins({
        key: 'addRegularCheckup',
        args: { bundleConfigs, bundlessConfigs, preBundleConfig },
    });
    // source checkup
    const sourceReport = [];
    for (const file of sourceFiles) {
        sourceReport.push(...(await api.applyPlugins({
            key: 'addSourceCheckup',
            args: {
                file,
                content: fs_1.default.readFileSync(path_1.default.join(api.cwd, file), 'utf-8'),
            },
        })));
    }
    // imports checkup
    const importsReport = [];
    for (const file of sourceFiles) {
        // skip non-javascript files
        // TODO: support collect imports from style style pre-processor files
        if (!/\.(j|t)sx?$/.test(file))
            continue;
        importsReport.push(...(await api.applyPlugins({
            key: 'addImportsCheckup',
            args: {
                file,
                imports: (await (0, parser_1.default)(path_1.default.join(api.cwd, file))).imports,
                mergedAlias,
                mergedExternals,
                configProviders,
            },
        })));
    }
    return [
        ...regularReport.filter(Boolean),
        ...sourceReport.filter(Boolean),
        ...importsReport.filter(Boolean),
    ];
};
