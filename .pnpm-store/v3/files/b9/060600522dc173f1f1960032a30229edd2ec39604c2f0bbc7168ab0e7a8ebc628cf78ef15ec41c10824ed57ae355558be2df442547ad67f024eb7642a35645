"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const utils_1 = require("@umijs/utils");
const constants_1 = require("../constants");
const service_1 = require("../service/service");
const utils_2 = require("../utils");
const node_1 = require("./node");
async function run(_opts) {
    (0, node_1.checkVersion)();
    (0, node_1.checkLocal)();
    (0, node_1.setNodeTitle)();
    (0, node_1.setNoDeprecation)();
    const args = (_opts === null || _opts === void 0 ? void 0 : _opts.args) ||
        (0, utils_1.yParser)(process.argv.slice(2), {
            alias: {
                version: ['v'],
                help: ['h'],
            },
            boolean: ['version'],
        });
    const command = args._[0];
    if (command === constants_1.DEV_COMMAND) {
        process.env.NODE_ENV = 'development';
        // handle ctrl+c and exit with 0, to avoid pnpm exit with error
        /* istanbul ignore next -- @preserve */
        process.on('SIGINT', () => process.exit(0));
    }
    else if (constants_1.BUILD_COMMANDS.includes(command)) {
        process.env.NODE_ENV = 'production';
    }
    // set quiet mode for logger
    if (args.quiet)
        utils_2.logger.setQuiet(args.quiet);
    try {
        const service = new service_1.Service();
        await service.run2({
            name: command,
            args: (0, utils_1.deepmerge)({}, args),
        });
        // handle restart for dev command
        if (command === constants_1.DEV_COMMAND) {
            async function listener(data) {
                if ((data === null || data === void 0 ? void 0 : data.type) === 'RESTART') {
                    // off self
                    process.off('message', listener);
                    // restart
                    run({ args });
                }
            }
            process.on('message', listener);
        }
    }
    catch (e) {
        utils_2.logger.error(e);
        process.exit(1);
    }
}
exports.run = run;
