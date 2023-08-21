"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = __importDefault(require("../builder"));
exports.default = (api) => {
    api.registerCommand({
        name: 'build',
        description: 'build for production',
        options: `
--no-clean  do not clean all output directories before build
`,
        async fn({ args }) {
            await (0, builder_1.default)({
                userConfig: api.config,
                cwd: api.cwd,
                pkg: api.pkg,
                clean: args.clean,
                buildDependencies: [
                    api.pkgPath,
                    api.service.configManager.mainConfigFile,
                ].filter(Boolean),
            });
        },
    });
};
