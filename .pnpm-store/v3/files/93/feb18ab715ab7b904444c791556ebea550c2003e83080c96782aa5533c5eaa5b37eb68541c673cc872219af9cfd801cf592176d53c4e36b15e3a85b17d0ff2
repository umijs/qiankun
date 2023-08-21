"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapRpc = void 0;
const controlled_promise_1 = require("../utils/async/controlled-promise");
const rpc_error_1 = require("./rpc-error");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapRpc(childProcess) {
    return ((...args) => __awaiter(this, void 0, void 0, function* () {
        if (!childProcess.send) {
            throw new Error(`Process ${childProcess.pid} doesn't have IPC channels`);
        }
        else if (!childProcess.connected) {
            throw new Error(`Process ${childProcess.pid} doesn't have open IPC channels`);
        }
        const id = uuid();
        // create promises
        const { promise: resultPromise, resolve: resolveResult, reject: rejectResult, } = (0, controlled_promise_1.createControlledPromise)();
        const { promise: sendPromise, resolve: resolveSend, reject: rejectSend, } = (0, controlled_promise_1.createControlledPromise)();
        const handleMessage = (message) => {
            if ((message === null || message === void 0 ? void 0 : message.id) === id) {
                if (message.type === 'resolve') {
                    // assume the contract is respected
                    resolveResult(message.value);
                    removeHandlers();
                }
                else if (message.type === 'reject') {
                    rejectResult(message.error);
                    removeHandlers();
                }
            }
        };
        const handleClose = (code, signal) => {
            rejectResult(new rpc_error_1.RpcExitError(code
                ? `Process ${childProcess.pid} exited with code ${code}` +
                    (signal ? ` [${signal}]` : '')
                : `Process ${childProcess.pid} exited` + (signal ? ` [${signal}]` : ''), code, signal));
            removeHandlers();
        };
        // to prevent event handler leaks
        const removeHandlers = () => {
            childProcess.off('message', handleMessage);
            childProcess.off('close', handleClose);
        };
        // add event listeners
        childProcess.on('message', handleMessage);
        childProcess.on('close', handleClose);
        // send call message
        childProcess.send({
            type: 'call',
            id,
            args,
        }, (error) => {
            if (error) {
                rejectSend(error);
                removeHandlers();
            }
            else {
                resolveSend(undefined);
            }
        });
        return sendPromise.then(() => resultPromise);
    }));
}
exports.wrapRpc = wrapRpc;
function uuid() {
    return new Array(4)
        .fill(0)
        .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
        .join('-');
}
