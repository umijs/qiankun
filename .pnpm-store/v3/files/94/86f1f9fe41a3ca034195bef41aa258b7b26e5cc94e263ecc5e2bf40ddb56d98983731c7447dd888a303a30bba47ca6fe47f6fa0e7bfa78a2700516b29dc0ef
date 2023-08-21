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
exports.createPool = void 0;
const abort_error_1 = require("./abort-error");
function createPool(size) {
    let pendingPromises = [];
    const pool = {
        submit(task, signal) {
            return __awaiter(this, void 0, void 0, function* () {
                while (pendingPromises.length >= pool.size) {
                    abort_error_1.AbortError.throwIfAborted(signal);
                    yield Promise.race(pendingPromises).catch(() => undefined);
                }
                abort_error_1.AbortError.throwIfAborted(signal);
                const taskPromise = task(signal).finally(() => {
                    pendingPromises = pendingPromises.filter((pendingPromise) => pendingPromise !== taskPromise);
                });
                pendingPromises.push(taskPromise);
                return taskPromise;
            });
        },
        size,
        get pending() {
            return pendingPromises.length;
        },
        get drained() {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                while (pendingPromises.length > 0) {
                    yield Promise.race(pendingPromises).catch(() => undefined);
                }
                resolve(undefined);
            }));
        },
    };
    return pool;
}
exports.createPool = createPool;
