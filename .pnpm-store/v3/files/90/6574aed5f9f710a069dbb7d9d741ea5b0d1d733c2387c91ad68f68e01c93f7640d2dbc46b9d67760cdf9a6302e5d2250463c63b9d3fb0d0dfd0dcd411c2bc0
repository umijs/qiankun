"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interceptDoneToGetDevServerTap = void 0;
const infrastructure_logger_1 = require("../infrastructure-logger");
function interceptDoneToGetDevServerTap(compiler, config, state) {
    const { debug } = (0, infrastructure_logger_1.getInfrastructureLogger)(compiler);
    // inspired by https://github.com/ypresto/fork-ts-checker-async-overlay-webpack-plugin
    compiler.hooks.done.intercept({
        register: (tap) => {
            if (tap.name === 'webpack-dev-server' && tap.type === 'sync' && config.devServer) {
                debug('Intercepting webpack-dev-server tap.');
                state.webpackDevServerDoneTap = tap;
            }
            return tap;
        },
    });
}
exports.interceptDoneToGetDevServerTap = interceptDoneToGetDevServerTap;
