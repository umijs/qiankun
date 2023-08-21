"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = require("../../rpc");
const config_1 = require("./lib/config");
const dependencies_1 = require("./lib/dependencies");
const system_1 = require("./lib/system");
const getDependenciesWorker = (change) => {
    system_1.system.invalidateCache();
    if ((0, config_1.didConfigFileChanged)(change) || (0, config_1.didDependenciesProbablyChanged)((0, dependencies_1.getDependencies)(), change)) {
        (0, config_1.invalidateConfig)();
        (0, dependencies_1.invalidateDependencies)();
    }
    return (0, dependencies_1.getDependencies)();
};
(0, rpc_1.exposeRpc)(getDependenciesWorker);
