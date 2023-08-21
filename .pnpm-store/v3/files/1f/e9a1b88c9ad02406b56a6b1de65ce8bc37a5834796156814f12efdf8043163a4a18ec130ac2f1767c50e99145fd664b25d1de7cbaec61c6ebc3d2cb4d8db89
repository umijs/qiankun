"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfrastructureLogger = void 0;
function getInfrastructureLogger(compiler) {
    const logger = compiler.getInfrastructureLogger('ForkTsCheckerWebpackPlugin');
    return {
        log: logger.log.bind(logger),
        debug: logger.debug.bind(logger),
        error: logger.error.bind(logger),
        warn: logger.warn.bind(logger),
        info: logger.info.bind(logger),
    };
}
exports.getInfrastructureLogger = getInfrastructureLogger;
