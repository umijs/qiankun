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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exposeRpc = void 0;
const process_1 = __importDefault(require("process"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exposeRpc(fn) {
    const sendMessage = (message) => new Promise((resolve, reject) => {
        if (!process_1.default.send) {
            reject(new Error(`Process ${process_1.default.pid} doesn't have IPC channels`));
        }
        else if (!process_1.default.connected) {
            reject(new Error(`Process ${process_1.default.pid} doesn't have open IPC channels`));
        }
        else {
            process_1.default.send(message, undefined, undefined, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(undefined);
                }
            });
        }
    });
    const handleMessage = (message) => __awaiter(this, void 0, void 0, function* () {
        if (message.type === 'call') {
            if (!process_1.default.send) {
                // process disconnected - skip
                return;
            }
            let value;
            let error;
            try {
                value = yield fn(...message.args);
            }
            catch (fnError) {
                error = fnError;
            }
            try {
                if (error) {
                    yield sendMessage({
                        type: 'reject',
                        id: message.id,
                        error,
                    });
                }
                else {
                    yield sendMessage({
                        type: 'resolve',
                        id: message.id,
                        value,
                    });
                }
            }
            catch (sendError) {
                // we can't send things back to the parent process - let's use stdout to communicate error
                if (error) {
                    console.error(error);
                }
                console.error(sendError);
            }
        }
    });
    process_1.default.on('message', handleMessage);
}
exports.exposeRpc = exposeRpc;
