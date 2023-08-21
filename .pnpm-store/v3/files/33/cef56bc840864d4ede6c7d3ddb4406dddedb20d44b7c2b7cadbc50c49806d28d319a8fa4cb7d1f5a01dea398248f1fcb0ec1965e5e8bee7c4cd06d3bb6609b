"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogLevels = ['debug', 'info', 'warn', 'error'];
exports.prefixedLogger = (prefix, logger) => {
    const newLogger = {};
    for (const logLevel of LogLevels) {
        newLogger[logLevel] = wrapLogMethod(logger, logLevel, (log, args) => log(prefix, ...args));
    }
    return newLogger;
};
exports.leveledLogger = (logger, minimumLogLevel) => {
    const newLogger = {};
    for (const logLevel of LogLevels) {
        if (LogLevels.indexOf(minimumLogLevel) > LogLevels.indexOf(logLevel)) {
            continue;
        }
        newLogger[logLevel] = wrapLogMethod(logger, logLevel, (log, args) => log(args.shift(), ...args));
    }
    return newLogger;
};
const wrapLogMethod = (logger, method, callback) => {
    const logFunction = logger[method];
    if (!logFunction) {
        return;
    }
    return (arg, ...args) => callback((arg, ...args) => logFunction.apply(logger, [arg, ...args]), [arg, ...args]);
};
//# sourceMappingURL=logger.js.map