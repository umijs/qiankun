"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_extractor_1 = require("@microsoft/api-extractor");
const utils_1 = require("@umijs/utils");
// @ts-ignore
const ncc_1 = __importDefault(require("@vercel/ncc"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const shared_1 = require("./shared");
const utils_2 = require("../utils");
exports.default = async (opts) => {
    // patch @microsoft/api-extractor before prepare config
    // use require() rather than import(), to avoid jest runner to fail
    // ref: https://github.com/nodejs/node/issues/35889
    require('./patcher');
    const config = (0, config_1.getConfig)(opts);
    const count = Object.keys(config.deps).length;
    const startTime = Date.now();
    // bundle deps
    for (const dep in config.deps) {
        const { output, pkg, nccConfig } = config.deps[dep];
        const outputDir = path_1.default.dirname(output);
        utils_2.logger.info(`Pre-bundle ${utils_1.chalk.yellow(pkg.name)} to ${utils_1.chalk.yellow((0, utils_1.winPath)(path_1.default.relative(opts.cwd, outputDir)))}`);
        await (0, ncc_1.default)(dep, nccConfig).then(({ code, assets, }) => {
            // create dist path
            if (!fs_1.default.existsSync(outputDir)) {
                fs_1.default.mkdirSync(outputDir, { recursive: true });
            }
            // TODO: dist content validate
            // emit dist file
            fs_1.default.writeFileSync(output, code, 'utf-8');
            // emit assets
            Object.entries(assets).forEach(([name, item]) => {
                fs_1.default.writeFileSync(path_1.default.join(outputDir, name), item.source, {
                    encoding: 'utf-8',
                    mode: item.permissions,
                });
            });
            // emit package.json
            fs_1.default.writeFileSync(path_1.default.join(outputDir, 'package.json'), JSON.stringify({
                name: pkg.name,
                version: pkg.version,
                author: pkg.author,
                authors: pkg.authors,
                contributors: pkg.contributors,
                license: pkg.license,
                _lastModified: new Date().toISOString(),
            }), 'utf-8');
        });
    }
    // bundle dts
    if (Object.keys(config.dts).length) {
        utils_2.logger.quietExpect.event(`Generate declaration files...`);
        for (const dts in config.dts) {
            api_extractor_1.Extractor.invoke(config.dts[dts].maeConfig, {
                localBuild: true,
                showVerboseMessages: false,
            });
            let content = (0, shared_1.getSharedData)(config.dts[dts].output);
            const outputDir = path_1.default.dirname(config.dts[dts].output);
            // create dist path
            if (!fs_1.default.existsSync(outputDir)) {
                fs_1.default.mkdirSync(outputDir, { recursive: true });
            }
            // process extra targeted externals
            Object.entries(config.dts[dts].externals).forEach(([name, value]) => {
                // only process externals with different targets
                // such as { a: 'b' }, and skip { a: 'a' }
                // because normal externals will be processed by api-extractor
                if (name !== value) {
                    content = content.replace(new RegExp(`from ("|')${name}["']`, 'g'), `from $1${value}$1`);
                }
            });
            // emit dist file
            fs_1.default.writeFileSync(config.dts[dts].output, content, 'utf-8');
        }
    }
    if (count) {
        utils_2.logger.quietExpect.event(`Pre-bundled successfully in ${Date.now() - startTime} ms (${count} deps)`);
    }
};
