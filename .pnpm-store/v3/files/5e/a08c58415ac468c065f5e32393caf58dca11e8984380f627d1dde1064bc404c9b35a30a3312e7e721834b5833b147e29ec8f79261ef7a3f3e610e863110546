"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRpcWorkerData = exports.createRpcWorker = void 0;
const child_process = __importStar(require("child_process"));
const process = __importStar(require("process"));
const wrap_rpc_1 = require("./wrap-rpc");
const WORKER_DATA_ENV_KEY = 'WORKER_DATA';
function createRpcWorker(modulePath, data, memoryLimit) {
    const options = {
        env: Object.assign(Object.assign({}, process.env), { [WORKER_DATA_ENV_KEY]: JSON.stringify(data || {}) }),
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
        serialization: 'advanced',
    };
    if (memoryLimit) {
        options.execArgv = [`--max-old-space-size=${memoryLimit}`];
    }
    let childProcess;
    let remoteMethod;
    const worker = {
        connect() {
            if (childProcess && !childProcess.connected) {
                childProcess.kill('SIGTERM');
                childProcess = undefined;
                remoteMethod = undefined;
            }
            if (!(childProcess === null || childProcess === void 0 ? void 0 : childProcess.connected)) {
                childProcess = child_process.fork(modulePath, options);
                remoteMethod = (0, wrap_rpc_1.wrapRpc)(childProcess);
            }
        },
        terminate() {
            if (childProcess) {
                childProcess.kill('SIGTERM');
                childProcess = undefined;
                remoteMethod = undefined;
            }
        },
        get connected() {
            return Boolean(childProcess === null || childProcess === void 0 ? void 0 : childProcess.connected);
        },
        get process() {
            return childProcess;
        },
    };
    return Object.assign((...args) => {
        if (!worker.connected) {
            // try to auto-connect
            worker.connect();
        }
        if (!remoteMethod) {
            return Promise.reject('Worker is not connected - cannot perform RPC.');
        }
        return remoteMethod(...args);
    }, worker);
}
exports.createRpcWorker = createRpcWorker;
function getRpcWorkerData() {
    return JSON.parse(process.env[WORKER_DATA_ENV_KEY] || '{}');
}
exports.getRpcWorkerData = getRpcWorkerData;
